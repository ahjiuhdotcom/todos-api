// Create model for "todo"

module.exports =  function(sequelize, Datatype) {

	return sequelize.define("todo", {
		description: {
			type: Datatype.STRING,
			allowNull: false,
			validate: {
				len: [1, 250]
			}
		},
		completed: {
			type: Datatype.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	});
}