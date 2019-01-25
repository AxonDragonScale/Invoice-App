
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
const PORT = process.env.PORT || 8128;

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
                message: "Password is Incorrect, Please retry."
            });
        }
    });
});



// setting up the /invoice route
// handles invoice creation
app.post('/invoice', function (req, res) {
    if (isEmpty(req.body.name)) {
        return res.json({
            status: false,
            message: "name field for invoice not found."
        });
    } else if (isEmpty(req.body.user_id)) {
        return res.json({
            status: false,
            message: "user_id field for invoice not found."
        });
    }

    let db = new sqlite.Database('./database/InvoiceApp.db');
    let paid = 0;
    for (let i = 0; i < req.body.txn_prices.length; i++) {
        paid = paid + parseInt(req.body.txn_prices[i]);
    }
    let sql = `INSERT INTO invoices(name, user_id, paid) VALUES('${req.body.name}','${req.body.user_id}','${paid}')`;

    db.serialize(function () {
        db.run(sql, function (err) {
            if (err) {
                throw err;
            }

            let invoice_id = this.lastID;
            for (let i = 0; i < req.body.txn_names.length; i++) {
                let query = `INSERT INTO transactions(name, price, invoice_id) VALUES('${req.body.txn_names[i]}','${req.body.txn_prices[i]}','${invoice_id}')`;
                db.run(query, function (err) {
                    if (err) {
                        return res.json({
                            status: false,
                            message: "Error creating invoice."
                        });
                    }
                });
            }

            return res.json({
                status: true,
                message: "Invoice created successfully."
            });
        });
    });
});




// route for fetching all invoices of a user
// ex - localhost:8128/invoice/user/2   ->   this gives req.params.user_id = 2
app.get("/invoice/user/:user_id", function (req, res) {
    let db = new sqlite.Database("./database/InvoiceApp.db");
    let sql = `SELECT * FROM invoices LEFT JOIN transactions on invoices.id=transactions.invoice_id WHERE user_id='${req.params.user_id}'`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        console.log(rows);

        return res.json({
            status: true,
            transactions: rows
        });
    });
});



// route for fetching a specific invoice
app.get("/invoice/user/:user_id/invoice/:invoice_id", function (req, res) {
    let db = new sqlite.Database("./database/InvoiceApp.db");
    let sql = `SELECT * FROM invoices LEFT JOIN transactions ON invoices.id=transactions.invoice_id WHERE user_id='${req.params.user_id}' AND invoice_id='${req.params.invoice_id}'`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }

        return res.json({
            status: true,
            transactions: rows
        });
    });
});