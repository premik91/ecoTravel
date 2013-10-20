require 'json'

class TripController < SFWcontroller

	def init
		@helper = loadController(:helper)
		@helper.setCORS
	end

	def error(str)
		body << {error: str}.to_json
	end

	def success
		body << {success: true}.to_json
	end

	def checkUser
		return @user if @user
		@user = loadModel(:user).get( session[:id] )
		p @user
	end


	# začni potovanje
	def post_start(mode)
		return unless checkUser

		return error 'Eno potovanje je že v teku.' if @user[:activeTrip]

		# način potovanja
		mode = db.value 'SELECT id
			FROM modes
			WHERE mode = ?', mode
		return error 'Ta način potovanja ne obstaja!' unless mode

		db.transaction {
			tripID = db.value 'INSERT INTO trips (userID, modeID)
				VALUES (?, ?) RETURNING id', @user[:id], mode
			db.raw 'UPDATE users SET
				activeTrip = ?
				WHERE id = ?', tripID, @user[:id]
		}

		success
	end

	# končaj potovanje
	def post_stop
		return unless checkUser

		return error 'Uporabnik nima potovanja.' unless @user[:activeTrip]

		db.raw 'UPDATE users SET activeTrip = NULL WHERE id = ?', @user[:id]

		success
	end

	# dodaj GPS koordinato
	def post_addPoint(x, y, km, speed, time)
		return unless checkUser

		tripID = @user[:activeTrip]
		return error 'Uporabnik nima potovanja.' unless tripID

		db.transaction {
			db.raw 'INSERT INTO points (tripID, x, y, km)
				VALUES (?, ?, ?, ?)', tripID, x, y, km
			db.value 'UPDATE trips
				SET totalKm = totalKm + ?
				WHERE id = ?', km, tripID
		}

		co2 = 80 # TODO

		# pošlji vsem websocket clientom
		shared[:clients].each { |ws|
			ws.send (km * co2).to_s
		} if shared[:clients]

		success
	end

	# ta metoda služi temu, da se ne dela preveč zahtevkov
	def post_batch
		data = JSON.parse params['data'], symbolize_names: true
		p data

		data.each { |command|
			if command[:journey] == 'Stop'
				post_stop
			elsif command[:journey]
				post_start command[:journey]
			else
				post_addPoint command[:x], command[:y], command[:km],
				command[:speed], command[:time]
			end
		}
	end

end