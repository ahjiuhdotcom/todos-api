var bcrypt = require("bcrypt");
var _= require("underscore");


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
		salt: {
			type: Datatype.STRING
		},
		password_hash: {
			type: Datatype.STRING
		},
		password: {
			type: Datatype.VIRTUAL,
			allowNull: false,
			defaultValue: false,
			validate: {
				len: [3, 100]
			},
			set: function(value){
				var salt = bcrypt.genSaltSync(10); // 10 is number of character
				var hashedPassword = bcrypt.hashSync(value, salt);

				this.setDataValue("password", value);
				this.setDataValue("salt", salt);
				this.setDataValue("password_hash", hashedPassword);
			}
		}
	}, {
		hooks: {
			beforeValidate: function(user, options){
				if(typeof user.email === "string") {
					user.email = user.email.toLowerCase();
				}
			}
		},
		instanceMethods: {
			toPublicJSON: function(){
				var json = this.toJSON();
				return _.pick(json, "id", "email", "createdAt", "updatedAt");
			}
		}
	});
}