require 'json'

class ApiController < SFWsocket

	def init
		@helper = loadController(:helper)
		@helper.setCORS

		self.mime = 'application/json'
	end

	def error(str)
		body << {error: str}.to_json
	end

	def checkUser
		return @user if @user
		@user = loadModel(:user).get( session[:id] )
	end

	# vsi klici na API so HTTP GET

	def get_scoreboard(duration = 'alltime')
		ret = db.resultMultiHash :userID, 'SELECT name, T.*
			FROM totals T
			INNER JOIN users ON users.id = userID'

		body << @helper.boardAndSort(ret).to_json
	end

	# načini potovanja (vlak, peš, ...)
	def get_modes
		result = db.resultHash :mode, 'SELECT mode, co2 FROM modes ORDER BY id'
		result.each { |key, mode|
			result[key] = mode[:co2]
		}
		body << result.to_json
	end

	def get_graph
		result = db.resultHash :mode, 'SELECT MAX(mode) AS mode, SUM(km) AS km,
			SUM(total) AS total, SUM(saved) AS saved, SUM(number) AS number
			FROM totals GROUP BY modeID'
		body << result.to_json
	end

	def get_userCount
		body << db.value( 'SELECT COUNT(*) FROM users' ).to_s
	end

	# WEBSOCKETS

	def get_totalSaving(*)
		unless @ws
			body << 'Ta metoda zahteva povezavo s HTML5 websocketi.'
			return
		end

		shared[:clients] ||= []
		shared[:clients] << @ws

		@ws.send db.value( 'SELECT SUM(saved) FROM totals' ).to_s
	end

end