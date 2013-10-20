require './server.rb'

Thin::Logging.debug = :log
Rack::Handler::Thin.run(Server.new, Port: 8080) { |server|
	server.timeout = 600
}