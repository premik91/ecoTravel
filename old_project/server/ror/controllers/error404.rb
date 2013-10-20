class Error404Controller < SFWcontroller
	def index
		other
	end

	def other(name = nil, *)
		body << "404"
		notFound
	end

	def notFound
		self.status = 404
	end

	def redirect
		url.redirect
	end
end