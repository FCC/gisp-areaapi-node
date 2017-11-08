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
var helmet = require('helmet');

let package_json = require('./package.json');

let dotenv = require('dotenv').load();

let area = require('./controllers/area.js');


// **********************************************************
// config

let NODE_ENV = process.env.NODE_ENV;

let NODE_PORT = process.env.PORT;

// **********************************************************
// console start

console.log('package_json.name : '+ package_json.name );
console.log('package_json.version : '+ package_json.version );
console.log('package_json.description : '+ package_json.description );
console.log('## ENV ## DB_PG: '+process.env.DB_PG);
console.log('## ENV ## DB_SCHEMA: '+process.env.DB_SCHEMA);


// **********************************************************
// app

let app = express();
app.enable('strict routing');

app.use(cors());
app.use(helmet());

// **********************************************************
// route

app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/index.html', express.static(path.join(__dirname, '/public')));

/*
app.use('/api/census', function(req, res, next) {
   
  let newUrl = req.originalUrl.split('api/census')[1];
  
  if (newUrl === '' || newUrl === undefined) {
    newUrl = '/';
  }
  console.log('redirect to /');
  res.redirect(301, newUrl);

    // next();
});
*/

// **********************************************************
// log

let logDirectory = path.join(__dirname, '/log');

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

let accessLogStream = fsr.getStream({
    filename: logDirectory + '/fcc-areaapi-%DATE%.log',
    frequency: 'daily',
    verbose: false,
});

app.use(morgan('combined', {stream: accessLogStream}));

// **********************************************************
// parser

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

// **********************************************************
// route
// S Bressi - Changed from /api/(apiname) to just /(apiname)

app.get('/area', function(req, res) {
    area.getArea(req, res);
});

// The path for the get function of the exress app is changed by Ahmad Aburizaiza
app.get('/block/find', function(req, res) {
    area.getArea(req, res);
});

app.get('/block/:year/find', function(req, res) {
    area.getArea(req, res);
});


app.get('/', function(req, res) {

  res.status(200).send('Area API Main Page<p>Example API call:<p> <a href=area.json?lat=38.793&lon=-77.1> area.json?lat=38.793&lon=-77.1</a>');

});

// **********************************************************
// server

var server = app.listen(NODE_PORT, function() {

  let host = server.address().address;
  let port = server.address().port;

  console.log('\n  listening at http://%s:%s', host, port);

});

module.exports = app;
