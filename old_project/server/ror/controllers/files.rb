class FilesController < SFWfile

	def hit(*path)
		puts 'File ' + path.join('/') + ' hit.'
	end

	def cache(*path)

	end

	def miss(*path)
		puts 'File ' + path.join('/') + ' not found (error 404).'
	end

end