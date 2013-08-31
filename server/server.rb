require 'thin'
require 'faye/websocket'
require './sfw.rb'

class Server
	def initialize(shared = {})
		@shared = shared
		EventMachine.threadpool_size = 200
	end

	def threaded
		-> env {
			EventMachine.defer(
				-> { call env },
				-> r { env['async.callback'].call r }
			)
			throw :async
		}
	end

	def call(env)
		server = SFW.new env, @shared
		server.init env['REQUEST_URI'].encode('utf-8')
	end
end