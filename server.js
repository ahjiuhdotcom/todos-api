var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
var db = require("./db.js");

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

// var todos = [{
// 	id: 1,
// 	description: "Meet Jiji for lunch",
// 	completed: false
// }, {
// 	id: 2,
// 	description: "Go to market",
// 	completed: false
// }, {
// 	id: 3,
// 	description: "Web dev homework",
// 	completed: true
// }];

app.get("/", function(req, res){
	res.send("To do API Root");
});

// GET "/todos"
app.get("/todos", function(req, res){

	// // Filtering using "?xxx=zzz"
	// var queryParams = req.query;
	// var filteredTodos = todos;
	// // "where" can return a array of matching item
	// if (queryParams.hasOwnProperty("completed") && queryParams.completed === "true") {
	// 	filteredTodos = _.where(filteredTodos, {completed: true});
	// } else if (queryParams.hasOwnProperty("completed") && queryParams.completed === "false") {
	// 	filteredTodos = _.where(filteredTodos, {completed: false});
	// }

	// if (queryParams.hasOwnProperty("q") && queryParams.q.length > 0){
	// 	filteredTodos = _.filter(filteredTodos, function(todo){
	// 		// "todo" is individual todo item in the array of filteredTodos
	// 		return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
	// 	});
	// }

	// // this get request will return array of todos in json format
	// res.json(filteredTodos);

	var query = req.query;
	var where = {};

	if (query.hasOwnProperty("completed") && query.completed === "true"){
		where.completed = true;			
	} else if (query.hasOwnProperty("completed") && query.completed === "false"){
		where.completed = true;		
	}

	if (query.hasOwnProperty("q") && query.q.length > 0){
		where.description = {
			$like: "%" + query.q + "%"
		};
	}

	db.todo.findAll({where: where}).then(function(todos){
			res.json(todos);
			// if (!!todo) {
			// 	res.json(todo.toJSON());
			// } else {
			// 	res.status(404).send();
			// }
		}).catch(function(e){
			// "500" is server error
			res.status(500).send();
		});

});

// GET "/todos/:id"
app.get("/todos/:id", function(req, res){
	var todoId =  parseInt(req.params.id, 10);

	// for (var i=0; i<todos.length; i++) {
	// 	var todo = todos[i];
	// 	if (todo.id == todoId) {
	// 		// if using (todo.id === todoId), need to change todoId to js number (todo.id is number)
	// 		// using parseInt(re.params.id, 10) (most of the time using 10, type of number format)
	// 		return res.json(todos[i]);
	// 	} 
	// }
	// res.status(404).send();

	// // "findWhere" only return one and first item
	// var matchedTodo = _.findWhere(todos, {id: todoId});

	// if (matchedTodo) {
	// 	res.json(matchedTodo);
	// } else {
	// 	res.status(404).send();
	// }

	db.todo.findById(todoId).then(function(todo){
		// "!!" means taking a value that is not booolean
		// convert it to truthly version
		// e.g. "todo" is either object or Null
		// if "todo" is object, "!!todo" return true, else return false
		// similar check "if let" as of swift
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}).catch(function(e){
		// "500" is server error
		res.status(500).send();
	});
});

// POST "/todos"
// "body-parser" start required here
app.post("/todos", function(req, res){
	// the first argument is the array we want to pick
	// second element is the field we want to pick/maintain, others will be removed/cleaned
	var body = _.pick(req.body, "description", "completed");

	// if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
	// 	return res.status(400).send();
	// }

	// body.description = body.description.trim();
	// body.id = todoNextId;
	// todoNextId++;

	// todos.push(body);
	// res.json(body);

	// Method "db.todo" is part of "module.exports = db"
	db.todo.create(body).then(function(todo){
		console.log("New todo created");
		// object "todo" is not simple json object (it is sql object), 
		// it contain other sql related info
		res.json(todo.toJSON());
	}).catch(function(e){
		res.status(400).json(e);
	});
});

// DELETE "/todos/:id"
app.delete("/todos/:id", function(req, res){

	var todoId = parseInt(req.params.id, 10);

	// var matchedTodo = _.findWhere(todos, {id: todoId});

	// if (!matchedTodo){
	// 	res.status(404).json({"error": "No todo found with that id"});
	// } else {
	// 	todos = _.without(todos, matchedTodo);
	// 	res.json(matchedTodo);
	// }

	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function(rowDeleted){
		if (rowDeleted == 0) {
			res.status(404).json({
				error: "No todo with id"
			});
		} else {
			// "204" means everyhting went well but no data to send back
			res.status(204).send();
		}
	}, function(){
		res.status(500).send();
	});

});

// PUT "/todos/:id"
app.put("/todos/:id", function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, "description", "completed");
	var attributes = {};

	// if (!matchedTodo){
	// 	return res.status(404).send();
	// }

	// if (body.hasOwnProperty("completed") && _.isBoolean(body.completed)){
	// 	validAttributes.completed = body.completed;
	// } else if (body.hasOwnProperty("completed")) {
	// 	return res.status(400).send();
	// }

	// if (body.hasOwnProperty("description") && _.isString(body.description) && body.description.trim().length>0) {
	// 	validAttributes.description = body.description;
	// } else if (body.hasOwnProperty("description")) {
	// 	return res.status(400).send();
	// }

	// _.extend(matchedTodo, validAttributes);
	// res.json(matchedTodo);

	if (body.hasOwnProperty("completed")){
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty("description")) {
		attributes.description = body.description;
	}

	db.todo.findById(todoId).then(function(todo){
		if(todo) {
			return todo.update(attributes).then(function(todo){
						res.json(todo.toJSON());
					}, function(e){
						res.status(400).json(e);
					});
		} else {
			res.status(404).send();
		}
	}, function(){
		res.status(500).send();
	});
});

app.post("/users", function(req, res){
	var body = _.pick(req.body, "email", "password");
	
	db.user.create(body).then(function(user){
		console.log("New user created");
		res.json(user.toJSON());
	}, function(e){
		res.status(400).json(e);
	});
});

// Sync the database to server
// Method "db.sequelize" is part of "module.exports = db"
db.sequelize.sync().then(function(){
	app.listen(PORT, function(){
		console.log("Express listening on port: " + PORT);
	});
});

