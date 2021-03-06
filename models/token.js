var cryptojs = require("crypto-js");

module.exports = function(sequelize, Datatype){
	return sequelize.define("token", {
		token: {
			type: Datatype.VIRTUAL,
			allowNull: false,
			validate: {
				len:[1]
			},
			set: function(value){
				var hash = cryptojs.MD5(value).toString();

				this.setDataValue("token", value);
				this.setDataValue("tokenHash", hash)
			}
		},
		tokenHash: Datatype.STRING
	})
};