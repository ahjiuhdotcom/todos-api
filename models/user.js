var bcrypt = require("bcrypt");
var _= require("underscore");
var cryptojs = require("crypto-js");
var jwt = require("jsonwebtoken");


module.exports = function(sequelize, Datatype){
	var user = sequelize.define("user", {
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
		classMethods: {
			authenticate: function (body) {
				return new Promise(function(resolve, reject){
					if(typeof body.email !== "string" || typeof body.password !== "string"){
							return reject();
					}

					user.findOne({
						where: {
							email: body.email
						}
					}).then(function(user){
						if (!user || !bcrypt.compareSync(body.password, user.get("password_hash"))){
							// 401 means authentication is possible but failed
							return reject();
						} 
						resolve(user);
					}, function(e){
						reject();
					});
				});
			},
			findByToken: function(token) {
				return new Promise(function(resolve, reject) {
					try {
						var decodedJWT = jwt.verify(token, "jwt123");
						var bytes = cryptojs.AES.decrypt(decodedJWT.token, "abc123");
						// json data is in string. With JSON.parse, it convert it to js object
						var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

						user.findById(tokenData.id).then(function(user){
							if (user){
								resolve(user);
							} else {
								reject();
							}

						}, function(e){
							reject();
						})
					} catch (e) {
						reject();
					}
				});
			}
		},
		instanceMethods: {
			toPublicJSON: function(){
				var json = this.toJSON();
				return _.pick(json, "id", "email", "createdAt", "updatedAt");
			},
			generateToken: function(type) {
				if (!_.isString(type)){
					return undefined;
				}

				try {
					var stringData = JSON.stringify({id: this.get("id"), type: type});
					var encryptedData = cryptojs.AES.encrypt(stringData, "abc123").toString();
					var token = jwt.sign({
						token: encryptedData
					}, "jwt123");

					return token;

				} catch(e) {
					console.error(e);
					return undefined
				}
			}
		}
	});

	return user
}