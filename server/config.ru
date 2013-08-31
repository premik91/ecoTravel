require './server.rb'

#\ -w -p 8080
use Rack::Reloader, 0
use Rack::ShowExceptions
use Rack::Runtime
use Rack::Lint

run Server.new