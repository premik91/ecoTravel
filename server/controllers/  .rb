
class HelperController < SFWcontroller

	def setCORS
		headers['Access-Control-Allow-Origin'] = 'http://work.opacelica.si'
		headers['Access-Control-Allow-Credentials'] = 'true'
		headers['Access-Control-Allow-Headers'] = 'X-Requested-With, Content-Type'
	end

	def boardAndSort(result)
		result.map { |id, user|
			# koliko co2 smo prihranili
			saved = user.reduce(0) { |sum, el|
				sum + el[:saved]
			}
			# statistika glede na tip vožnje
			detailed = {}
			user.each { |mode|
				detailed[ mode[:mode] ] = mode[:km]
			}
			# podatki
			[ user.first[:name], saved, detailed ]
		}.sort { |a, b|
			b[1] <=> a[1]
		}
	end

end