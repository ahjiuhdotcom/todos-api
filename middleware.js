module.exports = function(db) {

	return {
		requireAuthentication: function(req, res, next){
			var token = req.get("Auth"); // "Auth" is from the header of POST /users/login
			
			db.user.findByToken(token).then(function(user){
				req.user = user;
				next();
			}, function(){
				res.status(401).send();
			});
		}
	};
};