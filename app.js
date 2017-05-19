/* jshint node: true */

// **********************************************************

'use strict';

// **********************************************************
// require 

var express = require('express');
var fs = require('fs');
var morgan = require('morgan');
var cors = require('cors');
var bodyparser = require('body-parser');
var path = require('path');
var fsr = require('file-stream-rotator');

var package_json = require('./package.json');

var dotenv = require('dotenv').load();

var area = require('./controllers/area.js');


// **********************************************************
// config

var NODE_ENV = process.env.NODE_ENV;

var NODE_PORT = process.env.PORT;

// **********************************************************
// console start

console.log('package_json.name : '+ package_json.name );
console.log('package_json.version : '+ package_json.version );
console.log('package_json.description : '+ package_json.description );
console.log('## ENV ## DB_PG: '+process.env.DB_PG);
console.log('## ENV ## DB_SCHEMA: '+process.env.DB_SCHEMA);


// **********************************************************
// app

var app = express();
app.enable('strict routing');

app.use(cors());

// **********************************************************
// log

var logDirectory = path.join(__dirname,'/log');

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

var accessLogStream = fsr.getStream({
    filename: logDirectory + '/fcc-areaapi-%DATE%.log',
    frequency: 'daily',
    verbose: false
});

app.use(morgan('combined', {stream: accessLogStream}));

// **********************************************************
// parser

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// **********************************************************
// route

app.get('/area.json', function(req, res){
    area.getArea(req, res, function(error, response) {
    if (error) {
        res.status(400).send({"status": "error", "statusCode": 400, "statusMessage": error});
    }
    else  {
    res.send(response);
    }
    });
});

app.get('/', function(req, res){

  res.status(200).send("Area API Main Page<p>Example API call:<p> <a href=area.json?lat=38.793&lon=-77.1> area.json?lat=38.793&lon=-77.1</a>");

});

// **********************************************************
// server

var server = app.listen(NODE_PORT, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('\n  listening at http://%s:%s', host, port);

});

module.exports = app;