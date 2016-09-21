var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
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
	// this get request will return array of todos in json format
	res.json(todos);
});

// GET "/todos/:id"
app.get("/todos/:id", function(req, res){
	var todoId =  parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		console.log("2")
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}

	// for (var i=0; i<todos.length; i++) {
	// 	var todo = todos[i];
	// 	if (todo.id == todoId) {
	// 		// if using (todo.id === todoId), need to change todoId to js number (todo.id is number)
	// 		// using parseInt(re.params.id, 10) (most of the time using 10, type of number format)
	// 		return res.json(todos[i]);
	// 	} 
	// }
	// res.status(404).send();
});

// POST "/todos"
// "body-parser" start required here
app.post("/todos", function(req, res){
	// the first argument is the array we want to pick
	// second element is the field we want to pick/maintain, others will be removed/cleaned
	var body = _.pick(req.body, "description", "completed");

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

	body.description = body.description.trim();
	body.id = todoNextId;
	todoNextId++;

	todos.push(body);
	res.json(body);
});

// DELETE "/todos/:id"
app.delete("/todos/:id", function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (!matchedTodo){
		res.status(404).json({"error": "No todo found with that id"});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
});

// PUT "/todos/:id"
app.put("/todos/:id", function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, "description", "completed");
	var validAttributes = {};

	if (!matchedTodo){
		return res.status(404).send();
	}

	if (body.hasOwnProperty("completed") && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty("completed")) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty("description") && _.isString(body.description) && body.description.trim().length>0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty("description")) {
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});

app.listen(PORT, function(){
	console.log("Express listening on port: " + PORT);
});