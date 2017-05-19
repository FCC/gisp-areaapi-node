
/* jshint node: true */

// **********************************************************

'use strict';

// **********************************************************

var dotenv = require('dotenv').load();
var DB_PG = process.env.DB_PG;
var DB_SCHEMA = process.env.DB_SCHEMA;

//db
var pg_query = require('pg-query');
pg_query.connectionParameters = DB_PG;

var q = "SELECT block_fips FROM " + DB_SCHEMA + ".areaapi_block LIMIT 1";

pg_query(q, [], function(pg_err, pg_rows, pg_res){
	if (pg_err){
		console.error('error running pg_query', pg_err);
	}
	else {
		console.log('Connected to DB');
	}
});


var query_area = function (lat, lon, callback) {

	var q = "SELECT block_fips,county_fips,county_name,state_fips,state_code,state_name,pop2015 as block_pop_2015,amt,bea,bta,cma,eag,ivm,mea,mta,pea,rea,rpc,vpc FROM " + 
		DB_SCHEMA + ".areaapi_block WHERE ST_Intersects(geom, ST_SetSRID(ST_MakePoint($2, $1),4326))";

	var vals = [lat, lon];

	pg_query(q, vals, function(pg_err, pg_rows, pg_res){
			if (pg_err){
			console.error('error running pg_query', pg_err);
			callback(pg_err, null);
			return;
		}
		else {

			for (var i = 0; i < pg_rows.length; i++) {
				pg_rows[i].block_pop_2015 = parseInt(pg_rows[i].block_pop_2015, 10);

			}


			var entry = {"input":
							{"lat": lat, "lon": lon},
					"results": pg_rows
						};

			callback(null, entry);

			return;

		}

	});

};

var getArea = function(req, res) {
	console.log('================== getArea API =============');

	var deg, min, sec, lat, lon, lat1, lon1, lat_dir, lon_dir, arr;

	lat = req.query.lat;
	lon = req.query.lon;

	
	if (lat === undefined || lat === "") {
		console.log('\n' + 'missing lat');
		res.status(400).send({
			'status': 'error',
			'statusCode':'400',
			'statusMessage': 'missing lat.'
		});
		return;
	}

	if (lon === undefined || lon === "") {
		console.log('\n' + 'missing lon');
		res.status(400).send({
			'status': 'error',
			'statusCode':'400',
			'statusMessage': 'missing lon.'
		});
		return;
	}

	if (!lat.match(/:/) && isNaN(lat)) {

		console.log('\n' + 'invalid lat value');
		res.status(400).send({
			'status': 'error',
			'statusCode':'400',
			'statusMessage': 'invalid lat value'
		});
		return;
	}


	if (!lon.match(/:/) && isNaN(lon)) {

		console.log('\n' + 'invalid lon value');
		res.status(400).send({
			'status': 'error',
			'statusCode':'400',
			'statusMessage': 'invalid lon value'
		});
		return;
	}


	if (lat.match(/:/)) {

		lat_dir = lat[lat.length-1].toLowerCase();
		if (lat_dir != "n" && lat_dir != "s") {
			console.log('\n' + 'wrong lat format');
			res.status(400).send({
				'status': 'error',
				'statusCode':'400',
				'statusMessage': 'wrong lat format.'
			});
			return;
		}

		arr = (lat.slice(0, -1)).split(":");

		if (arr.length != 3) {
			console.log('\n' + 'wrong lat format');
			res.status(400).send({
				'status': 'error',
				'statusCode':'400',
				'statusMessage': 'wrong lat format.'
			});
			return;
		}

		deg = arr[0];
		min = arr[1];
		sec = arr[2];

		if (isNaN(deg) || isNaN(min) || isNaN(sec)) {
			console.log('\n' + 'wrong lat format');
			res.status(400).send({
				'status': 'error',
				'statusCode':'400',
				'statusMessage': 'wrong lat format.'
			});
			return;
		}

		deg = parseFloat(deg, 10);
		min = parseFloat(min, 10);
		sec = parseFloat(sec, 10);

		lat1 = deg + min/60.0 + sec/3600.0;

		if (lat_dir == "s") {
			lat1 *= -1;
		}

	}
	else {
		lat1 = parseFloat(lat);
	}

	if (lon.match(/:/)) {

		lon_dir = lon[lon.length-1].toLowerCase();
		if (lon_dir != "w" && lon_dir != "e") {
			console.log('\n' + 'wrong lon format');
			res.status(400).send({
				'status': 'error',
				'statusCode':'400',
				'statusMessage': 'wrong lon format.'
			});
			return;
		}

		arr = (lon.slice(0, -1)).split(":");

		if (arr.length != 3) {
			console.log('\n' + 'wrong lon format');
			res.status(400).send({
				'status': 'error',
				'statusCode':'400',
				'statusMessage': 'wrong lon format.'
			});
			return;
		}

		deg = arr[0];
		min = arr[1];
		sec = arr[2];

		if (isNaN(deg) || isNaN(min) || isNaN(sec)) {
			console.log('\n' + 'wrong lon format');
			res.status(400).send({
				'status': 'error',
				'statusCode':'400',
				'statusMessage': 'wrong lon format.'
			});
			return;
		}

		deg = parseFloat(deg, 10);
		min = parseFloat(min, 10);
		sec = parseFloat(sec, 10);

		lon1 = deg + min/60.0 + sec/3600.0;

		if (lon_dir == "w") {
			lon1 *= -1;
		}
	}
	else {
		lon1 = parseFloat(lon);
	}

	if (lat1 < -90 || lat1 > 90 || lon1 < -180 || lon1 > 180) {
		console.log('\n' + 'invalid lat/lon range');
		res.status(400).send({
			'status': 'error',
			'statusCode':'400',
			'statusMessage': 'invalid lat/lon range.'
		});
		return;
	}


	query_area(lat1, lon1, function (error, result) {
		if (error) {
			res.status(400).send({
			'status': 'error',
			'statusCode':'400',
			'statusMessage': error
			});
			return;
		}
		else {
			res.status(200).send(
				result
			);
			return;
		}
	});
};


module.exports.getArea = getArea;
