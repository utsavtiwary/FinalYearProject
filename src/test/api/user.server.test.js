/**
 * Created by utsavtiwary on 09/04/16.
 */
var request = require("supertest");
var should = require("should");

var app = require('../../config/express');
var utils = require('../utils');

var User = require('../../app/models/user.server.model');

describe('GET users', function() {

    it("should return empty JSON array on startup", function(done){
        request(app)
            .get('/api/users')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res){
                if (err) {
                    return done(err);
                }
                res.body.length.should.equal(0);
                return done();
            });
    });


    it("should return a populated list if users exist", function(done){
        var user = new User({_id: "testUser1"});
        user.save(function(err) {
            if (err) {
                return done(err);
            } else {
                request(app)
                    .get('/api/users')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res){
                        if (err) {
                            return done(err);
                        } else {
                            res.body.length.should.equal(1);
                            var user1 = res.body[0];
                            user1._id.should.equal('testUser1');
                            return done();
                        }
                    });
            }
        })
    });
});

describe('POST users', function() {

    it("should post user with specified id to database", function(done){
        var testUser = "testUser";
        request(app)
            .post('/api/users')
            .send({username: testUser})
            .expect(200)
            .end(function(err){
                if (err) {
                    return done(err);
                } else {
                    User.findOne({_id: testUser}, function(err, user){
                        if (err) {
                            return done(err);
                        } else {
                            should.exist(user);
                            return done();
                        }
                    })
                }
            });
    });

    it("should not post duplicates to the server", function(done) {
        var user1 = new User({_id: "user1"});
        user1.save(function(err) {
            if (err) {
                return done(err);
            } else {
                request(app)
                    .post('/api/users')
                    .send({username: "user1"})
                    .expect(400)
                    .end(function(err, res) {
                        if (err) {
                            return done(err);
                        } else {
                            res.body.should.have.property('message');
                            res.body.message.should.equal('This username is already in use');
                            return done();
                        }
                    });
            }
        });
    });
});

describe('GET users/:userId', function() {

    it("should get an existing user from the server", function(done) {
        var user = "testUser";
        var testUser = new User({_id: user});
        testUser.save(function(err) {
            if (err) return done(err);
            else {
                request(app)
                    .get('/api/users/' + user)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) return done(err);
                        else {
                            res.body._id.should.equal(user);
                            return done();
                        }
                    })
            }
        })
    });

    it("should return an error message if a get is queried for a user that does not exist", function(done) {
        var user = "testUser";
        request(app)
            .get('/api/users/' + user)
            .expect(400)
            .end(function(err, res) {
                if (err) return done(err);
                else {
                    should.exist(res.body.message);
                    res.body.message.should.equal("This user does not exist.");
                    return done();
                }
            })
    })
});

describe('DELETE users/:userId', function() {

    it("should delete user with specified id from database", function(done) {
        var testUser = "testUser";
        var testUserObj = new User({_id: testUser});
        testUserObj.save(function (err) {
            if (err) {
                return done(err);
            } else {
                request(app)
                    .delete('/api/users/' + testUser)
                    .expect(200)
                    .end(function (err) {
                        if (err) {
                            return done(err);
                        } else {
                            User.findOne({_id: testUser}, function (err, user) {
                                if (err) {
                                    return done(err);
                                } else {
                                    should.not.exist(user);
                                    return done();
                                }
                            });
                        }
                    });
            }
        });
    });

    it("should not be able to delete users that do not exist and reply with an appropriate message", function(done){
        var testUser = "testUser";
        request(app)
            .delete('/api/users/' + testUser)
            .expect(400)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                } else {
                    res.body.message.should.equal("This user doesn't exist or has already been deleted");
                    return done(err);
                }
            });
    });
});
