
/* jshint node: true */

// **********************************************************

'use strict';

// **********************************************************

var js2xmlparser = require('js2xmlparser');
var dotenv = require('dotenv').load();
var DB_PG = process.env.DB_PG;
var DB_SCHEMA = process.env.DB_SCHEMA;

// db
var pg_query = require('pg-query');
pg_query.connectionParameters = DB_PG;

var q = 'SELECT block_fips FROM ' + DB_SCHEMA + '.areaapi_block LIMIT 1';

pg_query(q, [], function(pg_err, pg_rows, pg_res) {
	if (pg_err) {
		console.error('error running pg_query', pg_err);
	}
	else {
		console.log('Connected to DB');
	}
});


var query_area = function(lat, lon, callback) {

// The SQL query updated by Ahmad Aburizaiza
	var bbox = "string_to_array(replace(replace(replace(Cast(box2d(geom) as varchar), ' ', ','), 'BOX(', ''), ')', ''),',')::numeric(10,7)[]";
	var q = 'SELECT block_fips,'+bbox+' as bbox,county_fips,county_name,state_fips,state_code,state_name,pop2015 as block_pop_2015,amt,bea,bta,cma,eag,ivm,mea,mta,pea,rea,rpc,vpc FROM ' +
		DB_SCHEMA + '.areaapi_block WHERE ST_Intersects(geom, ST_Buffer(ST_SetSRID(ST_MakePoint($2, $1),4326),0.0001)) ORDER BY block_fips';
	
	var vals = [lat, lon];

	pg_query(q, vals, function(pg_err, pg_rows, pg_res) {
			if (pg_err) {
			console.error('error running pg_query', pg_err);
			callback(pg_err, null);
			return;
		}
		else {

			for (let i = 0; i < pg_rows.length; i++) {
				pg_rows[i].block_pop_2015 = parseInt(pg_rows[i].block_pop_2015, 10);

			}


			let entry = {'input':
							{'lat': lat, 'lon': lon},
					'results': pg_rows,
						};
			
			callback(null, entry);

			return;

		}

	});

};

let getArea = function(req, res) {

	console.log('================== getArea API =============');

	let deg, min, sec, year, lat, lon, lat1, lon1, lat_dir, lon_dir, latitude, longitude, arr, showall, format;

	lat = req.query.lat;
	lon = req.query.lon;
	latitude = req.query.latitude; // for old API
	longitude = req.query.longitude; // for old API
	showall = req.query.showall; // for old API
	format = req.query.format; // for old API
	year = req.params.year;

	if (year !== '2010' && year !== undefined){
		console.log('\n' + 'The only available census year is 2010');
			res.status(400).send({
				'status': 'error',
				'statusCode': '400',
				'statusMessage': 'The only available census year for now is 2010',
				});
			return;
	}

	/*
	// Year in the API's URL is now a parameter, edited by Ahmad Aburizaiza
	if (req.url.includes('api/block/')){
		year = req.params.year;

		// This if statement is temporary until we get an access to census blocks 2000, edited by Ahmad Aburizaiza
		if (year !== '2010') {
			
		}
		
	}
	*/
	
	if (format != undefined && format != 'json' && format != 'xml' && format != 'jsonp') {
		console.log('\n' + 'invalid format value');
		res.status(400).send({
			'status': 'error',
			'statusCode': '400',
			'statusMessage': 'invalid format value',
		});
		return;
	}
	
	if (lat === undefined && latitude) {
		lat = latitude;
	}

	if (lon === undefined && longitude) {
		lon = longitude;
	}

	if (lat === undefined || lat === '') {
		console.log('\n' + 'missing lat');
		res.status(400).send({
			'status': 'error',
			'statusCode': '400',
			'statusMessage': 'missing lat.',
		});
		return;
	}

	if (lon === undefined || lon === '') {
		console.log('\n' + 'missing lon');
		res.status(400).send({
			'status': 'error',
			'statusCode': '400',
			'statusMessage': 'missing lon.',
		});
		return;
	}

	if (!lat.match(/:/) && isNaN(lat)) {

		console.log('\n' + 'invalid lat value');
		res.status(400).send({
			'status': 'error',
			'statusCode': '400',
			'statusMessage': 'invalid lat value',
		});
		return;
	}

	if (!lon.match(/:/) && isNaN(lon)) {

		console.log('\n' + 'invalid lon value');
		res.status(400).send({
			'status': 'error',
			'statusCode': '400',
			'statusMessage': 'invalid lon value',
		});
		return;
	}

	if (lat.match(/:/)) {

		lat_dir = lat[lat.length-1].toLowerCase();
		if (lat_dir != 'n' && lat_dir != 's') {
			console.log('\n' + 'wrong lat format');
			res.status(400).send({
				'status': 'error',
				'statusCode': '400',
				'statusMessage': 'wrong lat format.',
			});
			return;
		}

		arr = (lat.slice(0, -1)).split(':');

		if (arr.length != 3) {
			console.log('\n' + 'wrong lat format');
			res.status(400).send({
				'status': 'error',
				'statusCode': '400',
				'statusMessage': 'wrong lat format.',
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
				'statusCode': '400',
				'statusMessage': 'wrong lat format.',
			});
			return;
		}

		deg = parseFloat(deg, 10);
		min = parseFloat(min, 10);
		sec = parseFloat(sec, 10);

		lat1 = deg + min/60.0 + sec/3600.0;

		if (lat_dir == 's') {
			lat1 *= -1;
		}

	}
	else {
		lat1 = parseFloat(lat);
	}

	if (lon.match(/:/)) {

		lon_dir = lon[lon.length-1].toLowerCase();
		if (lon_dir != 'w' && lon_dir != 'e') {
			console.log('\n' + 'wrong lon format');
			res.status(400).send({
				'status': 'error',
				'statusCode': '400',
				'statusMessage': 'wrong lon format.',
			});
			return;
		}

		arr = (lon.slice(0, -1)).split(':');

		if (arr.length != 3) {
			console.log('\n' + 'wrong lon format');
			res.status(400).send({
				'status': 'error',
				'statusCode': '400',
				'statusMessage': 'wrong lon format.',
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
				'statusCode': '400',
				'statusMessage': 'wrong lon format.',
			});
			return;
		}

		deg = parseFloat(deg, 10);
		min = parseFloat(min, 10);
		sec = parseFloat(sec, 10);

		lon1 = deg + min/60.0 + sec/3600.0;

		if (lon_dir == 'w') {
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
			'statusCode': '400',
			'statusMessage': 'invalid lat/lon range.',
		});
		return;
	}

	query_area(lat1, lon1, function(error, result) {
		if (error) {
			res.status(400).send({
			'status': 'error',
			'statusCode': '400',
			'statusMessage': error,
			});
			return;
		}
		else {

			if (latitude && longitude) {
				if (result.results.length > 1) {
					if (showall === 'true') {
						if (format === undefined || format === 'xml') {
							var intersection = '';
							for (var i = 0; i < result.results.length; i++) {
								intersection += '<intersection FIPS="' + result.results[i].block_fips + '"/>';
							}
							var xml = '<Response status="OK" executionTime="0"><Block FIPS="' + result.results[0].block_fips +
								'" bbox="' + result.results[0].bbox +
								'">' + intersection + '</Block><County FIPS="' + result.results[0].county_fips + '" name="' + result.results[0].county_name +
								'"/><State FIPS="' + result.results[0].state_fips + '" code="' + result.results[0].state_code +
								'" name="' + result.results[0].state_name + '"/><messages>FCC0001: The coordinate lies on the boundary of mulitple blocks, first FIPS is displayed. For a complete list use showall=true to display \'intersection\' element in the Block</messages></Response>';
							res.status(200).set('Content-Type', 'text/xml').send(xml);
								}
						else if (format === 'json' || format === 'jsonp') {
							var intersection = [];
							for (var i = 0; i < result.results.length; i++) {
								intersection.push({'FIPF': result.results[i].block_fips});
							}
							var json = {
										'messages': [
													'FCC0001: The coordinate lies on the boundary of mulitple blocks, first FIPS is displayed. For a complete list use showall=true to display \'intersection\' element in the Block'
													],
										'Block': {
											'FIPS': result.results[0].block_fips,
											'bbox': result.results[0].bbox,
											'intersection': intersection,
											},
										'County': {
											'FIPS': result.results[0].county_fips,
											'name': result.results[0].county_name,
											},
										'State': {
										'FIPS': result.results[0].state_fips,
										'code': result.results[0].state_code,
										'name': result.results[0].state_name,
										},
										'status': 'OK',
										'executionTime': '0'
										};
						
							if (format === 'json') {
								res.status(200).set('Content-Type', 'application/json').send(json);
							}
							else if (format === 'jsonp') {
								res.status(200).set('Content-Type', 'application/x-javascript').send('callback(' + JSON.stringify(json) + ')');
							}
							
						}


					}
					else {
						if (format === undefined || format === 'xml') {
							var xml = '<Response status="OK" executionTime="0"><Block FIPS="' + result.results[0].block_fips +
								'" bbox="' + result.results[0].bbox +
								'"/><County FIPS="' + result.results[0].county_fips + '" name="' + result.results[0].county_name +
								'"/><State FIPS="' + result.results[0].state_fips + '" code="' + result.results[0].state_code +
								'" name="' + result.results[0].state_name + '"/><messages>FCC0001: The coordinate lies on the boundary of mulitple blocks, first FIPS is displayed. For a complete list use showall=true to display \'intersection\' element in the Block</messages></Response>';
						
							res.status(200).set('Content-Type', 'text/xml').send(xml);
						}
						else if (format === 'json' || format === 'jsonp') {
							var json = {
										'messages': [
													'FCC0001: The coordinate lies on the boundary of mulitple blocks, first FIPS is displayed. For a complete list use showall=true to display \'intersection\' element in the Block'
													],
										'Block': {
											'FIPS': result.results[0].block_fips,
											'bbox': result.results[0].bbox,
											},
										'County': {
											'FIPS': result.results[0].county_fips,
											'name': result.results[0].county_name,
											},
										'State': {
										'FIPS': result.results[0].state_fips,
										'code': result.results[0].state_code,
										'name': result.results[0].state_name,
										},
										'status': 'OK',
										'executionTime': '0'
										};
							if (format === 'json') {
								res.status(200).set('Content-Type', 'application/json').send(json);
							}
							else if (format === 'jsonp') {
								res.status(200).set('Content-Type', 'application/x-javascript').send('callback(' + JSON.stringify(json) + ')');
							}
						}
					
					
					}
					
					
				}
				// This eles if statement is added by Ahmad Aburizaiza
				// It handles empty query results that were causing the
				// application to crash, when a user enters coordinates outside the US boundaries
				else if (result.results.length === 0){
					if (format === undefined || format === 'xml') {
						var xml = '<Response status="OK" executionTime="0"><Block FIPS="null" bbox="null"/><County FIPS="null" name="null"/><State FIPS="null" code="null" name="null"/></Response>';
						res.status(200).set('Content-Type', 'text/xml').send(xml);
					}
					else if (format === 'json' || format === 'jsonp') {
						var json = {
							'Block': {
								'FIPS': null,
								'bbox': null,
								},
							'County': {
								'FIPS': null,
								'name': null,
								},
							'State': {
							'FIPS': null,
							'code': null,
							'name': null,
							},
							'status': 'OK',
							'executionTime': '0'
							};

						if (format === 'json') {
							res.status(200).set('Content-Type', 'application/json').send(json);
						}
						else if (format === 'jsonp') {
							res.status(200).set('Content-Type', 'application/x-javascript').send('callback(' + JSON.stringify(json) + ')');
						}
					
					}

				}
				else {
					if (format === undefined || format === 'xml') {
						var xml = '<Response status="OK" executionTime="0"><Block FIPS="' + result.results[0].block_fips +
									'" bbox="' + result.results[0].bbox +
									'"/><County FIPS="' + result.results[0].county_fips + '" name="' + result.results[0].county_name +
									'"/><State FIPS="' + result.results[0].state_fips + '" code="' + result.results[0].state_code +
									'" name="' + result.results[0].state_name + '"/></Response>';
						res.status(200).set('Content-Type', 'text/xml').send(xml);
					}
					else if (format === 'json' || format === 'jsonp') {
						var json = {
							'Block': {
								'FIPS': result.results[0].block_fips,
								'bbox': result.results[0].bbox,
								},
							'County': {
								'FIPS': result.results[0].county_fips,
								'name': result.results[0].county_name,
								},
							'State': {
							'FIPS': result.results[0].state_fips,
							'code': result.results[0].state_code,
							'name': result.results[0].state_name,
							},
							'status': 'OK',
							'executionTime': '0'
							};

						if (format === 'json') {
							res.status(200).set('Content-Type', 'application/json').send(json);
						}
						else if (format === 'jsonp') {
							res.status(200).set('Content-Type', 'application/x-javascript').send('callback(' + JSON.stringify(json) + ')');
						}
					
					}
				}

			}
			else {
				if (format === undefined || format === 'json' || format=== 'jsonp') {
					if (format === undefined || format === 'json') {
						res.status(200).set('Content-Type', 'application/json').send(result);
					}
					else if (format === 'jsonp') {
						res.status(200).set('Content-Type', 'application/x-javascript').send('callback(' + JSON.stringify(result) + ')');
					}
				}
				else if (format === 'xml') {
					var xml = js2xmlparser('area', result);
					res.status(200).set('Content-Type', 'text/xml').send(xml);
				}
				
			}
			return;
		}
	});
};


module.exports.getArea = getArea;
