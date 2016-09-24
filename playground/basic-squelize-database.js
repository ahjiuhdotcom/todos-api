var Sequelize = require("sequelize");
var sequelize = new Sequelize(undefined, undefined, undefined, {
	"dialect": "sqlite",
	"storage": __dirname + "/basic-sqlite-database.sqlite"
});

var Todo = sequelize.define("todo", {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

// sync({force: true}) to drop everything and recreate the fresh database
sequelize.sync({force:true}).then(function(){
	console.log("Everything is synced");
	Todo.create({
		description: "Walk my dog",
		completed: false
	}).then(function(todo){
		console.log("Finished create 1");
		return Todo.create({
			description: "Clean office"
		});
	}).then(function(){
		console.log("Finished create 2");
		// return Todo.findById(1)
		return Todo.findAll({
			where: {
				description: {
					// "$like" allow looks for words inside attribute
					// "%dog%" means contain "dog" 
					$like: "%dog%"
				}
			}
		});
	}).then(function(todos){
		if(todos){
			console.log("Finished retrieve");
			todos.forEach(function(todo){
				console.log(todo.toJSON());
			});
		} else {
			console.log("No to do found");
		}
	}).catch(function(e){
		console.log(e);
	});
});