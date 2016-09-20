var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: "Meet mom for lunch",
	completed: false
}, {
	id: 2,
	description: "Go to market",
	completed: false
}, {
	id: 3,
	description: "Web dev homework",
	completed: true
}];

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
			return res.json(todos[i]);
		} 
	}
	res.status(404).send();
});


app.listen(PORT, function(){
	console.log("Express listening on port: " + PORT);
});