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
                    .get('/area.json?lat=38.26&lon=-77.51')
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
                    .get('/area.json?lat=38:15:30N&lon=77:30:30W')
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
                    .get('/area.json?lat=38.26x&lon=-77.51')
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
                    .get('/area.json?lat=38.26&lon=-77.5x')
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
                    .get('/area.json?lat=190&lon=190')
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
                    .get('/area.json?lon=-77')
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
                    .get('/area.json?lat=38.2')
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
                    .get('/area.json?lat=38:15N&lon=77:30:30W')
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
                    .get('/area.json?lat=38:30:15N&lon=77:30W')
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
                    .get('/area.json?lat=38:30:15x&lon=77:30:15W')
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
                    .get('/area.json?lat=38:30:15N&lon=77:30:15x')
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
                    .get('/area.json?lat=38x:30:15N&lon=77:30:15W')
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
                    .get('/area.json?lat=38:30:15N&lon=77x:30:15W')
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
                    .get('/area.json?lat=38:30:15S&lon=77:30:15W')
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