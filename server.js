var express = require("express");
var bodyParser = require("body-parser");
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
	var todoId =  req.params.id;

	for (var i=0; i<todos.length; i++) {
		var todo = todos[i];
		if (todo.id == todoId) {
			// if using (todo.id === todoId), need to change todoId to js number (todo.id is number)
			// using parseInt(re.params.id, 10) (most of the time using 10, type of number format)
			return res.json(todos[i]);
		} 
	}
	res.status(404).send();
});

// POST "/todos"
// "body-parser" start required here
app.post("/todos", function(req, res){
	var body = req.body;
	body.id = todoNextId;
	todoNextId++;

	todos.push(body);
	
	res.json(body);

});


app.listen(PORT, function(){
	console.log("Express listening on port: " + PORT);
});