// this script executes migrations (1.0.js)

const path = require("path");
// umzug is a migration tool for nodejs. We will use it to cleanly run and roll back database tasks
const Umzug = require("umzug");

// create umzug object with given options/configs
let umzug = new Umzug({
    logging: function() {
        console.log.apply(null, arguments);     // apply calls a function with given arguments
    },

    migrations: {
        path: "./database/migrations",
        pattern: /\.js$/
    },

    upName: "up",
    downName: "down"

});

function logUmzugEvent(eventName) {
    return function(name, migration) {
        console.log(`${name} ${eventName}`);
    };
}

// set event listeners for event logging
umzug.on("migrating", logUmzugEvent("migrating"));
umzug.on("reverting", logUmzugEvent("reverting"));
umzug.on("migrated", logUmzugEvent("migrated"));
umzug.on("reverted", logUmzugEvent("reverted"));

// run the migration
umzug.up().then(console.log("All Migrations done."));