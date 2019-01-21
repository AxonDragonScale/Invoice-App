
// Load all modules
// require() returns module.exports object
const express = require('express');
const bodyparser = require('body-parser');
const sqlite = require('sqlite3').verbose();

// Construct express app 
const app = express();
// use middleware that parses urlencoded bodies, false - use querystring library instead of qs library
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());     // use json parser middleware
const PORT = process.env.PORT || 8000;

// create a simple '/' route 
// routes HTTP GET request to '/' and calls the fucntion specified
app.get('/', function (req, res) {
    res.send("Welcome to Invoice-App");
});

// app.listen() tells the server about which port to listen to for incoming routes
app.listen(PORT, function () {
    console.log("App is running on localhost:${PORT}");
});



// setting up /register route using POST
const bcrypt = require('bcrypt');
const saltRounds = 10;

function isEmpty(str) {
    return !str || 0 === str.length;
}

// post() routes HTTP post request to specified path and calls the function
app.post('/register', function (req, res) {
    //if any field is empty, it fails
    if (isEmpty(req.body.name) || isEmpty(req.body.email) ||
        isEmpty(req.body.company_name) || isEmpty(req.body.password)) {
        return res.json({
            'status': false,
            'message': 'All fields required'
        });
    }

    // if all fields are properly present, save user in database
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        let db = new sqlite.Database("./database/InvoiceApp.db");
        let sql = `INSERT INTO users(name, email, company_name, password) VALUES('${req.body.name}','${req.body.email}','${req.body.company_name}','${hash}')`;

        db.run(sql, function (err) {
            if (err) {
                throw err;
            } else {
                return res.json({
                    status: true,
                    message: 'User Created'
                });
            }
        });

        db.close();
    });
});



// setting up the /login route using POST
app.post('/login', function (req, res) {
    let db = new sqlite.Database('./database/InvoiceApp.db');
    let sql = `SELECT * FROM users WHERE email='${req.body.email}'`;

    // all() runs the sql commands and returns the result in rows array
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        db.close();

        // if result array rows is empty, no user exists
        if (rows.length == 0) {
            return res.json({
                status: false,
                message: "Sorry, Incorrect email"
            });
        }

        let user = rows[0];
        let authenticated = bcrypt.compareSync(req.body.password, user.password);   // true if password matches
        delete user.password;   // delete the password entered by user for security

        if (authenticated) {
            return res.json({
                status: true,
                user: user
            });
        } else {
            return res.json({
                status: false,
                message: "Password is Incorrect"
            });
        }
    });
});
