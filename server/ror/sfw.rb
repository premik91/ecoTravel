require 'date'
require 'benchmark'

class SFWbase #abstract
	def initialize(parent = nil)
		finalizers << self if @parent = parent
		@plugins = {}
		puts self.class.to_s + ' initialized.'
	end

	attr_accessor :parent

	def httpGet(url)
		require 'net/http'
		Net::HTTP.get_response(URI.parse url).body
	end

	def loadFile(name)
		if File.exists? name
			production ? require('./'+name) : load(name)
			true
		end
	end

	def loadPlugin(name, cfgFile = 'config/'+name.to_s+'.rb')
		return false unless loadFile 'plugins/'+name.to_s+'.rb'
		plugin = Kernel.const_get(name.to_s.capitalize+'Plugin').new self
		eval File.read(cfgFile) if cfgFile && File.exists?(cfgFile)
		plugin
	end

	def loadModel(name, *args)
		return false unless loadFile 'models/'+name.to_s+'.rb'
		model = Kernel.const_get(name.to_s.capitalize+'Model').new self
		model.send :init, *args
		model
	end

	def loadController(name, *args)
		return false unless loadFile 'controllers/'+name.to_s+'.rb'
		controller = Kernel.const_get(name.to_s.capitalize+'Controller').new self
		controller.send :init, *args
		controller
	end

	def loadView(*name)
		if shared && production
			shared[:views] ||= {}
			template = shared[:views][name]
		end
		unless template
			fileName = 'views/'+name.join('/')+'.erb'
			if File.exists? fileName
				require 'erb'
				template = ERB.new File.read(fileName)
			else
				fileName = 'views/'+name.join('/')+'.haml'
				return unless File.exists? fileName
				require 'haml'
				template = Haml::Engine.new File.read(fileName), ugly: true, remove_whitespace: true
			end
			shared[:views][name] = template if shared && production
		end

		case template.class.to_s
		when 'ERB'
			template.result binding
		when 'Haml::Engine'
			template.render binding
		end
	end

	def method_missing(name, *args)
		if @plugins && @plugins[name]
			@plugins[name]
		elsif parent
			parent.send name, *args
		else
			@plugins[name] = loadPlugin(name) || throw('Variable '+name.to_s+' does not exist.')
		end
	end

	def finalize
	end
end

class SFW < SFWbase
	def initialize(env, shared = nil)
		@status = 200
		@headers = {'Connection' => 'Keep-Alive', 'Date' => Time.now.httpdate}
		@mime = 'text/html'
		@body = ''

		@env = env
		@params = Rack::Utils.parse_nested_query @env['rack.input'].read
		@shared = shared
		@finalizers = []
		super()
	end

	attr_accessor :status, :headers, :mime, :body
	attr_reader :env, :params, :shared, :finalizers

	def init(path)
		url.path = path
		request *url.newPath
	end

	def request(name = :welcome, action = nil, *path)
		controller = loadController name
		controller ||= loadController :error404

		if action
			missing = true

			calls = [ '_'+action.to_s ]
			calls << env['REQUEST_METHOD'].downcase + calls.first

			calls.each { |call|
				if controller.respond_to? call
					controller.send call, *path
					missing = false
				end
			}

			controller.send :other, action, *path if missing
		else
			controller.send :index, *path
		end

		finalizers.reverse_each(&:finalize)
		@headers['Content-Type'] =  @mime + '; charset=utf-8' unless @status == 304

		[@status, @headers, [@body]]
	end

	def production
		! ['lh', 'localhost', '::1', '0.0.0.0'].include?( @env['SERVER_NAME'] ) && @env['SERVER_NAME'] !~ /127\.\d{1,3}\.\d{1,3}\.\d{1,3}/
	end
end

class SFWplugin < SFWbase
	def config
	end
end

class SFWmodel < SFWbase

end

class SFWcontroller < SFWbase
	def init(*)
	end

	def index(*)
		body << 'It works. Please create the index() method.'
	end

	def other(name, *args)
		loadController('error404').send :other, self.class, args
	end
end

class SFWsocket < SFWcontroller
	def initialize(*)
		super
		if Faye::WebSocket.websocket?(env)
			@ws = Faye::WebSocket.new env
			@ws.onclose = -> event {
				p [:close, event.code, event.reason]
				@ws = nil
			}
		end
	end

	def finalize
		self.status, self.headers, self.body = *@ws.rack_response if @ws
	end
end

class SFWfile < SFWcontroller
	def index
		other
	end

	def other(*args)
		args.shift if args[0].to_s =~ /^\d*$/
		path = 'public/' + args.join('/')
		@mime = Rack::Mime.mime_type File.extname(path)
		if File.exists? path
			self.mime = @mime
			headers['Cache-Control'] = 'public'
			headers['Vary'] = 'Accept-Encoding'

			@modified = File.mtime(path)
			headers['Last-Modified'] = @modified.httpdate
			headers['Expires'] = (DateTime.now >> 12).httpdate

			self.body = if @modified.to_i <= (Time.httpdate(env['HTTP_IF_MODIFIED_SINCE']).to_i rescue 0)
				cache *args
				self.status = 304
				''
			elsif !alreadyCompressed && env['HTTP_ACCEPT_ENCODING'].to_s.split(',').map(&:strip).include?('deflate')
				hit *args
				require 'zlib'
				headers['Content-Encoding'] = 'deflate'
				Zlib.deflate File.read(path)
			else
				hit *args
				File.read(path)
			end
		else
			miss *args
			self.status = 404
		end
	end

	def alreadyCompressed
		not ['text/javascript', 'text/css'].include? @mime
	end
end
