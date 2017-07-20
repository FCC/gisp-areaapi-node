'use strict';

var request = require('supertest');
var server = require('../app.js');
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

describe('Area API', function() {

    describe('Input', function() {
        describe('Valid parameter format and value', function() {

            it('should return data based on correct decimal input', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/area?lat=38.26&lon=-77.51')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.should.have.property('input');
                        res.body.should.have.property('results');

                        done();
                    });
            });

            it('should return data based on correct deg-min-sec input', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/area?lat=38:15:30N&lon=77:30:30W')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.should.have.property('input');
                        res.body.should.have.property('results');

                        done();
                    });
            });

            it('should return data based on correct deg-min-sec input with format xml', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/area?lat=38:15:30N&lon=77:30:30W&format=json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.should.have.property('input');
                        res.body.should.have.property('results');

                        done();
                    });
            });

            it('should return error on wrong decimal lat input', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/area?lat=38.26x&lon=-77.51')
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.should.have.property('status');

                        done();
                    });
            });

            it('should return error on wrong decimal lon input', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/area?lat=38.26&lon=-77.5x')
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.should.have.property('status');

                        done();
                    });
            });

            it('should return error on out-of-range decimal input', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/area?lat=190&lon=190')
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.should.have.property('status');

                        done();
                    });
            });

            it('should return error on missing decimal lat input', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/area?lon=-77')
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.should.have.property('status');

                        done();
                    });
            });

            it('should return error on missing decimal lon input', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/area?lat=38.2')
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.should.have.property('status');

                        done();
                    });
            });

            it('should return error on incorrect deg-min-sec input (missing lat sec)', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/area?lat=38:15N&lon=77:30:30W')
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.should.have.property('status');

                        done();
                    });
            });

            it('should return error on incorrect deg-min-sec input (missing lon sec)', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/area?lat=38:30:15N&lon=77:30W')
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.should.have.property('status');

                        done();
                    });
            });

            it('should return error on incorrect deg-min-sec input (wrong lat_dir)', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/area?lat=38:30:15x&lon=77:30:15W')
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.should.have.property('status');

                        done();
                    });
            });

            it('should return error on incorrect deg-min-sec input (wrong lon_dir)', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/area?lat=38:30:15N&lon=77:30:15x')
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.should.have.property('status');

                        done();
                    });
            });

            it('should return error on incorrect deg-min-sec input (invalid lat value)', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/area?lat=38x:30:15N&lon=77:30:15W')
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.should.have.property('status');

                        done();
                    });
            });

            it('should return error on incorrect deg-min-sec input (invalid lon value)', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/area?lat=38:30:15N&lon=77x:30:15W')
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.should.have.property('status');

                        done();
                    });
            });

            it('test lat south', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/area?lat=38:30:15S&lon=77:30:15W')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.should.have.property('input');

                        done();
                    });
            });

            
        });
    });

    describe('Main Page', function() {
        it('should return main page when calling /', function(done) {
            this.timeout(15000);
            setTimeout(done, 15000);

            request(server)
                .get('/')
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    done();
                });
        });

    });

});

describe('Block API', function() {

    describe('Input', function() {
        describe('Valid parameter format and value', function() {

            it('should return data based on correct decimal input - xml', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/block/2010/find?latitude=38.26&longitude=-77.51&format=xml&showall=true')
                    .expect('Content-Type', /xml/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        done();
                    });
            }); 

            it('should return data based on correct decimal input - json', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/block/2010/find?latitude=38.26&longitude=-77.51&format=json&showall=true')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        done();
                    });
            });
			
			it('should return data based on correct decimal input - jsonp', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/block/2010/find?latitude=38.26&longitude=-77.51&format=jsonp&showall=true')
                    .expect('Content-Type', /x-javascript/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        done();
                    });
            });
			
			it('should return data based on correct decimal input - xml - multiple blocks', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/block/2010/find?latitude=36.084737999999994&longitude=-90.79048499999996&format=xml&showall=true')
                    .expect('Content-Type', /xml/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        done();
                    });
            });
			
			it('should return data based on correct decimal input - json - multiple blocks', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/block/2010/find?latitude=36.084737999999994&longitude=-90.79048499999996&format=json&showall=true')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        done();
                    });
            });
			
			it('should return data based on correct decimal input - jsonp - multiple blocks', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/block/2010/find?latitude=36.084737999999994&longitude=-90.79048499999996&format=jsonp&showall=true')
                    .expect('Content-Type', /x-javascript/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        done();
                    });
            });
			
			it('should return data based on correct decimal input - xml - multiple blocks, not showall', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/block/2010/find?latitude=36.084737999999994&longitude=-90.79048499999996&format=xml')
                    .expect('Content-Type', /xml/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }
                        done();
                    });
            });
			
			it('should return data based on correct decimal input - json - multiple blocks, no showall', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/block/2010/find?latitude=36.084737999999994&longitude=-90.79048499999996&format=json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }
                        done();
                    });
            });
			
			it('should return data with no showall value - multiple blocks - xml', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/block/2010/find?latitude=36.084737999999994&longitude=-90.79048499999996&format=xml&showall=')
                    .expect('Content-Type', /xml/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        done();
                    });
            });
			
			it('should return data with no showall value - multiple blocks - json', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/block/2010/find?latitude=36.084737999999994&longitude=-90.79048499999996&format=json&showall=')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        done();
                    });
            });
			
			it('should return data with no showall value - multiple blocks - jsonp', function(done) {
                this.timeout(15000);
                setTimeout(done, 15000);

                request(server)
                    .get('/api/block/2010/find?latitude=36.084737999999994&longitude=-90.79048499999996&format=jsonp&showall=')
                    .expect('Content-Type', /x-javascript/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        done();
                    });
            });
			

			
			
			


			
        });
    });

});


describe('Main Page', function() {
	it('should return main page when calling /', function(done) {
		this.timeout(15000);
		setTimeout(done, 15000);

		request(server)
			.get('/')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					throw err;
				}

				done();
			});
	});

});

