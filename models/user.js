
module.exports = function(sequelize, Datatype){
	return sequelize.define("user", {
		email: {
			type: Datatype.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: Datatype.STRING,
			allowNull: false,
			defaultValue: false,
			validate: {
				len: [3, 100]
			}
		}
	}, {
		hooks: {
			beforeValidate: function(user, options){
				if(typeof user.email === "string") {
					user.email = user.email.toLowerCase();
				}
			}
		}
	});
}