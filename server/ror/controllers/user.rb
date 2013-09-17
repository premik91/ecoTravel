require 'json'

class UserController < SFWcontroller

	def init
		@helper = loadController(:helper)
		@helper.setCORS
	end

	def json(str)
		JSON.parse str, symbolize_names: true
	end

	def check
		unless @id = session[:id]
			body << 'Nisi prijavljen!'
			return false
		end
		return true
	end

	# metodi za dobit prijatelje in osnovne informacije, obe GET

	def get_friends
		return unless check

		result = json httpGet( 'https://graph.facebook.com/me/friends?fields=id&limit=5000&access_token=' + session[:token] )
		unless result[:data]
			body << result.to_json
			return
		end

		ids = result[:data].map { |id|
			id[:id].to_i
		}

		ret = db.resultMultiHash :userID, 'SELECT name, T.*
			FROM totals T
			INNER JOIN users ON users.id = userID
			WHERE fbID IN ? OR userID = ?', ids, @id

		body << @helper.boardAndSort(ret).to_json
	end

	def get_summary
		return unless check

		result = db.resultHash(:mode,
			'SELECT mode, km, total, saved, number FROM totals WHERE userID = ?', @id
		)
		ret = {name: loadModel(:user).get(@id)[:name],
			total: 0, saved: 0, km: 0, modes: result}
		result.each { |key, mode|
			ret[:total] += mode[:total]
			ret[:saved] += mode[:saved]
			ret[:km] += mode[:km]
		}
		body << ret.to_json
	end

	# prijava / odjava

	def _login(token = '')
		p token
		return unless token

		user = json httpGet( 'https://graph.facebook.com/me?access_token=' + token )
		if user && user[:id]
			id = db.value 'UPDATE users SET email = ?, storage = ? WHERE fbID = ? RETURNING id',
				user[:email], user.to_json, user[:id]
			id = db.value 'INSERT INTO users (fbID, name, email, storage) SELECT ?, ?, ?, ? RETURNING id',
				user[:id], user[:name], user[:email], user.to_json unless id
			session[:id] = id
			session[:token] = token
			body << id.to_s
			p id.to_s
		else
			body << user.to_json
		end

	end

	def post_logout
		session.destroy
	end

end