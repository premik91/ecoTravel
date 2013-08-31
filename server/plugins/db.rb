require 'pg'

class TimeInterval < Hash

	def initialize(str)
		self[:year] = 0
		self[:mon] = 0
		self[:day] = 0
		str.scan(/([-+]?\d+)\s*(year|mon|day)/) { |amount, unit|
			self[unit.to_sym] = amount.to_i
		}
		if str =~ /([+-]?)(\d+):(\d+):(\d+\.*\d*)/
			self[:sec] = (3600*$2.to_i + 60*$3.to_i + $4.to_f) * ($1 == '-' ? -1 : 1)
		end
	end

	def to_time
		self + Date.new(1970)
	end

	def +(date)
		time = ( (date >> 12*self[:year] + self[:mon]) + self[:day] ).to_time
		time + time.gmt_offset + self[:sec]
	end

	def to_f
		to_time.to_f
	end

	def to_i
		to_time.to_i
	end

	def to_s
		str = [:year, :mon, :day].map { |unit|
			self[unit].to_s + ' ' + unit.to_s + 's' if self[unit] != 0
		}.compact.join ' '

		if self[:sec] != 0
			sec = self[:sec].abs
			str << ' ' << ('-' if self[:sec] < 0).to_s <<
			(sec/3600).floor.to_s <<
			':' << (sec%3600/60).floor.to_s <<
			':' << (sec%60).round(6).to_s
		end
		str
	end

	def to_json(*)
		to_f.to_s
	end
end

class DbPlugin < SFWplugin
	def initialize(*)
		super
		@host = ''
		@port = 5432
		@user = 'postgres'
		@password = ''
		@db = 'postgres'

		@pool = nil
	end

	def handle
		unless @handle
			config if @handle.nil?
			if @pool
				@sig = [@host, @port, @user, @password, @db].join ' '
				@pool[@sig] ||= []
				@handle = @pool[@sig].pop
			end
			@handle = connect unless @handle
		end
		@handle
	end

	attr_accessor :host, :port, :user, :password, :db, :pool
	attr_reader :affectedRows

	def connect
		PG.connect host: @host, port: @post, user: @user, password: @password, dbname: @db
	end

	def ping
		PG::Connection.ping host: @host, port: @post, user: @user, password: @password, dbname: @db
	end

	def release
		if @pool && handle.transaction_status == 0
			@pool[@sig].push @handle
			@handle = false
			return true
		end
	end

	def castArray(value, type)
		inside = false
		escaped = false
		chars = value.split ''

		chars.map.with_index { |char, i|
			if char == '\\'
				escaped = !escaped
			else
				if char == '"' && !escaped
					inside = !inside
				elsif !inside
					if char == '{'
						char.replace '['
					elsif char == '}'
						char.replace ']'
					elsif char != ','
						char.replace( ('"' if ['[', ','].include? chars[i-1]).to_s +
							char + ('"' if ['}', ','].include? chars[i+1]).to_s )
					end
				end
				escaped = false
			end
		}

		func = -> arg {
			if arg.kind_of? Array
				arg.map(&func)
			else
				cast arg, type
			end
		}

		require 'json'
		JSON.load(chars.join).map(&func)
	end

	def cast(value, type)
		return if value.nil? || value == 'NULL'
		case type
		when 20, 21, 23, 1700 #int (1700 je numeric, razmisli)
			value.to_i
		when 1005, 1007, 1016 #int[]
			castArray value, 20
		when 700, 701 #float
			value.to_f
		when 16 #bool
			value == 't'
		when 25, 1043 #text, varchar
			value
		when 1009, 1015
			castArray value, 25
		when 114 #json
			require 'json'
			JSON.parse value, symbolize_names: true
		when 1083, 1114, 1184, 1266 #date, time
			DateTime.parse value
		when 1186 #interval
			TimeInterval.new value
		when 17 #bytea
			handle.unescape_bytea value
		when 869 #inet
			value
		else
			throw 'Invalid OID type of ' + type.to_s + ' (' + value + ')' if type < 40_000 && type != 705
			value
		end
	end

	def castHash(hash, result)
		Hash[ hash.map.with_index { |(key, value), i|
			[ key.to_sym, cast(value, result.ftype(i)) ]
		} ]
	end

	def escape(param, type = nil)
		return case param
		when Array
			'(' + param.map { |element|
				escape element
			}.join(',') + ')'
		when String
			if param.encoding.name == 'ASCII-8BIT'
				"'" + handle.escape_bytea(param) + "'"
			else
				"'" + handle.escape_string(param) + "'"
			end
		when Symbol
			handle.escape_identifier param.to_s
		when Integer, Float, TimeInterval, FalseClass, TrueClass
			param.to_s
		else
			'NULL'
		end
	end

	def prepare(query, *args)
		hash = args[-1].kind_of?(Hash) && args.pop || {}
		hash.merge! Hash[(0...args.size).zip args]

		i = -1
		p query.gsub(/[[:alpha:]]+/i) { |match|
			match =~ /[[:upper:]]/ && match =~ /[[:lower:]]/ && escape(match.to_sym) || match
		}.gsub(/\?(\w+)?\??([b])?/) { |match|
			key = $1 || i += 1
			key = key.to_sym if key.respond_to? :to_sym
			key = key.to_s unless hash.has_key? key

			hash.has_key?(key) && escape(hash[key], $2) || match
		}
	end

	def raw(query, *args)
		handle.async_exec prepare query, *args
	end

	def value(query, *args)
		result = raw query, *args
		cast(result.getvalue(0, 0), result.ftype(0)) if result.ntuples > 0
	end

	def row(query, *args)
		result = raw query, *args
		castHash result[0], result if result.ntuples > 0
	end

	def column(query, *args)
		result = raw query, *args
		result.column_values(0).map { |value|
			cast value, result.ftype(0)
		} if result.nfields > 0
	end

	def result(query, *args, &block)
		result = raw(query, *args)
		if block
			result.each { |row|
				yield castHash row, result
			}
		else
			result.map { |row|
				castHash row, result
			}
		end
	end

	def resultHash(key, query, *args)
		result = resultMultiHash key, query, *args
		result.each { |key, row|
			result[key] = row.first
		}
		result
	end

	def resultMultiHash(key, query, *args)
		ret = {}
		result = raw query, *args
		result.each { |row|
			bucket = row[ key.to_s ]

			row = castHash row, result
			row.delete key.to_sym

			ret[ bucket ] ||= []
			ret[ bucket ] << row
		}
		ret
	end

	def transaction(mode = nil)
		begin
			raw 'BEGIN' + (' ISOLATION LEVEL '+mode if mode).to_s
				yield
			raw 'COMMIT' if handle.transaction_status == 2
		rescue => e
			puts e
			puts e.backtrace
			rollback
		end
	end

	def rollback
		raw 'ROLLBACK'
	end

	def finalize
		unless release
			handle.finish unless handle.finished?
		end
	end
end