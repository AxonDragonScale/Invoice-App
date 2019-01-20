"use strict";

const Bluebird = require("bluebird");
const sqlite = require("sqlite3");
const path = require("path");

// can be imported in other files by require()
module.exports = {
    // up makes tables and down destroys them
    up: function() {
        return new Bluebird (function(resolve, reject) {
            // migration function
            let db = new sqlite.Database('./database/InvoiceApp.db');
            db.run(`PRAGMA foreign_keys = ON`);     // enable foreign key constraints

            // serialize specifies that the queries run sequentially not simultaneously
            db.serialize(function() {
                db.run(`CREATE TABLE users (
                    id INTEGER PRIMARY KEY,
                    name TEXT,
                    email TEXT,
                    company_name TEXT,
                    password TEXT
                )`);

                db.run(`CREATE TABLE invoices (
                    id INTEGER PRIMARY KEY,
                    name TEXT,
                    user_id TEXT,
                    paid NUMERIC,
                    FOREIGN KEY(user_id) REFERENCES users(id)
                )`);

                db.run(`CREATE TABLE transactions (
                    id INTEGER PRIMARY KEY,
                    name TEXT,
                    price INTEGER,
                    invoice_id INTEGER,
                    FOREIGN KEY(invoice_id) REFERENCES invoices(id)
                )`);

            });

            db.close();
        });
    },

    down: function() {
        return new Bluebird(function(resolve, reject) {
            // runs if we want to rollback changes.
            // reverts the up function and brings database back to initial state
            let db = new sqlite.Database('./database/InvoiceApp.db');
            db.serialize(function() {
                db.run(`DROP TABLE transactions`);
                db.run(`DROP TABLE invoices`);
                db.run(`DROP TABLE users`);
            });

            db.close();
        });
    }

};