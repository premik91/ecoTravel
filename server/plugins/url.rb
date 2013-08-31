require 'uri'

class UrlPlugin < SFWplugin
	def initialize(*)
		super
		@ending = '/'
		@base = '/'
		@fileBase = 'files' #nil to import them globally
		@fileTime = true
		@fullPath = false
	end

	def path=(path)
		len = path.start_with?(@base) && @base.length || 1
		@path = URI.unescape(path)[len..-1].chomp(@ending).split '/', -1
		@newPath = nil

		@protocol = env['rack.url_scheme'] + '://'
		@host = env['HTTP_HOST']

		@method = env['REQUEST_METHOD'].downcase
	end

	def newPath
		unless @newPath
			@newPath = @path.join('/')
			config
			@newPath = @newPath.split '/', -1
		end
		@newPath
	end

	attr_accessor :ending, :base, :fileBase, :fileTime, :fullPath
	attr_reader :protocol, :host, :method, :path #, :newPath

	def ajax?
		env["HTTP_X_REQUESTED_WITH"] == 'XMLHttpRequest'
	end

	def rewrite(from, to)
		@newPath.sub! from, to if from === @newPath
	end

	def slug(str)
		str.strip.downcase.gsub(/[^0-9a-z]+/i, '-').gsub(/^-+|-+$/, '')
	end

	def generate(*path)
		path.compact!
		path.map! { |seg|
			seg = path[seg] if seg.kind_of? Integer
			URI.escape(seg)
		}
		(@protocol+@host if @fullPath).to_s + @base + path.join('/')
	end

	def link(*path)
		generate(*path) + (@ending unless path.empty?).to_s
	end

	def linkSlug(*path)
		link *path.compact.map { |x| slug x }
	end

	def file(*path)
		name = 'public/' + path.join('/')
		time = File.mtime(name).to_i / 3 % 1000000 if File.exists? name
		generate @fileBase, (time.to_s if @fileTime), *path
	end

	def redirect(*path)
		self.status = 302
		self.headers['Location'] = if path.size == 1 && path.first =~ %r{^(https?:)?//}
			path.first
		else
			link *path
		end

	end

	def refresh
		redirect *@path
	end

	def forceSSL
		if @protocol != 'https://'
			@protocol, @fullPath = 'https://', true
			refresh
		end
	end
end