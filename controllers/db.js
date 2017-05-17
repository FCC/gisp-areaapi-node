
var dotenv = require('dotenv').load();
var NODE_ENV = process.env.NODE_ENV;
var NODE_PORT =  process.env.PORT;
var host =  process.env.HOST;
var DB_PG = process.env.DB_PG;
var DB_SCHEMA = process.env.DB_SCHEMA;

var promise = require('bluebird');
var options = {
  // Initialization Options
  promiseLib: promise
};
var pgp = require('pg-promise')(options);
var db = null;
try {
	db = pgp(DB_PG);
	console.log('\n' + 'connected to DB from db.js');
}
catch(e) {
	console.log('\n' + 'connection to DB failed' + e);
}

// Exporting the database object for shared use:
module.exports = db;