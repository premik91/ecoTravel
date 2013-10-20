require 'digest/md5'

class UserModel < SFWmodel


	def get(id)
		db.row 'SELECT * FROM users WHERE id=?', id if id
	end
end