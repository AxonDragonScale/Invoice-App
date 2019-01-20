
// Load all modules
// require() returns module.exports object
const express = require('express');
const bodyparser = require('body-parser');
const sqlite = require('sqlite3').verbose();

// Construct express app 
const app = express();  
// use middleware that parses urlencoded bodies, false - use querystring library instead of qs library
app.use(bodyparser.urlencoded({extended : false}));     
app.use(bodyparser.json());     // use json parser middleware
const PORT = process.env.PORT || 8000;

// create a simple '/' route 
// routes HTTP GET request to '/' and calls the fucntion specified
app.get('/', function(req, res) {
    res.send("Welcome to Invoice-App");
});

// app.listen() tells the server about which port to listen to for incoming routes
app.listen(PORT, function() {
    console.log("App is running on localhost:${PORT}");
});
