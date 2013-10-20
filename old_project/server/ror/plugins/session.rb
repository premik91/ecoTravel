require 'securerandom'

class SessionPlugin < SFWplugin
	def initialize(*)
		super
		@name = 'session'
		@path = url.base
		@duration = 30 #days
		@purgeRate = 100_000 #every 100K requests

		@lazyAccess = false
		@hashSize = 32

		@request = Rack::Request.new env
	end

	def id
		if @id.nil?
			config

			purge if 0 == rand(@purgeRate)

			@id = false
			params = [:ip, @request.ip.encode('UTF-8')]
			if @name != 'ip'
				return false unless @request.cookies[@name]
				params = [:hash, @request.cookies[@name].force_encoding('ASCII-8BIT')]
			end

			if row = db.row('WITH A AS (SELECT id, time FROM sessions WHERE ?=?)
			UPDATE sessions S SET time=NOW() FROM A WHERE S.id=A.id
			RETURNING A.id, A.time, S.time AS ntime', *params )
				if row[:ntime] - row[:time] > @duration
					destroy
				else
					@id = row[:id]
				end
			end
		end
		@id
	end

	def content
		unless @content
			@content = @lazyAccess && {} || getAll
		end
		@content
	end

	attr_accessor :name, :path, :duration, :purgeRate, :lazyAccess, :hashSize

	def purge
		db.raw 'DELETE FROM sessions WHERE time + ? < NOW()', @duration.to_s+'days'
	end

	def destroy
		return unless id
		db.raw 'DELETE FROM sessions WHERE id=?', @id
		Rack::Utils.delete_cookie_header! headers, @name, path: @path
		@id = false
		@content = nil
	end

	def hashCookie
		hash = SecureRandom.random_bytes @hashSize
		Rack::Utils.set_cookie_header! headers, @name, value: hash, httponly: true, path: @path, max_age: (10*365*24*60*60).to_s
		hash
	end

	def regenerate
		return if @name=='ip' || !id
		db.raw 'UPDATE sessions SET hash=? WHERE id=?', hashCookie, @id
	end

	def create
		return regenerate if id
		@id = db.value 'INSERT INTO sessions (?) VALUES (?) RETURNING id',
			*( @name == 'ip' ? [:ip, @request.ip.encode('UTF-8')] : [:hash, hashCookie] )
		@content = {}
	end

	def getAll
		hash = {}
		return hash unless id
		db.result('SELECT name, data FROM sessionData WHERE sessionID=?', id) { |row|
			hash[ row[:name].to_sym ] = Marshal.load row[:data]
		}
		hash
	end

	def [](key = nil)
		if key.nil?
			id && (@content = getAll) || {}
		else
			return content[key] if content.has_key?(key) && id
			if @lazyAccess && id
				content[key.to_sym] = Marshal.load db.value('SELECT data FROM sessionData WHERE sessionID=? AND name=?', @id, key.to_sym)
			end
		end
	end

	def []=(key, val)
		if val.nil?
			return unless id
			db.raw 'DELETE FROM sessionData WHERE sessionID=? AND name=?', @id, key.to_s
			@content.delete key if @content
		else
			create unless id
			# do the UPSERT
			db.raw 'WITH A AS (
				UPDATE sessionData SET data=?d WHERE sessionID=?id AND name=?n RETURNING *
			) INSERT INTO sessionData (sessionID, name, data) SELECT ?id, ?n, ?d
			WHERE NOT EXISTS(SELECT * FROM A)', id: @id, n: key.to_s, d: Marshal.dump(val)
			content[key.to_sym] = val
		end
		val
	end
end