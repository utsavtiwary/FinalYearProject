/**
 * Created by utsavtiwary on 09/04/16.
 */
var request = require("supertest");
var should = require("should");

var app = require('../../config/express');
var utils = require('../utils');
var mongoose = require('mongoose');

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
        var user = new User({local: {username: "testUser1", email: "testUser@ic.ac.uk", password: "testPass"}});
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
                            user1.local.username.should.equal('testUser1');
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
        var testEmail = "testUser@ic.ac.uk";
        var testPass = "testPass";
        request(app)
            .post('/api/users')
            .send({local: {username: testUser, email: testEmail, password: testPass}})
            .expect(200)
            .end(function(err){
                if (err) {
                    return done(err);
                } else {
                    User.findOne({'local.username': testUser}, function(err, user){
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
        var testUser = "testUser";
        var testEmail = "testUser@ic.ac.uk";
        var testPass = "testPass";

        var user1 = new User({local: {username: testUser, email: testEmail, password: testPass}});
        user1.save(function(err) {
            if (err) {
                return done(err);
            } else {
                request(app)
                    .post('/api/users')
                    .send({local: {username: testUser, email: testEmail, password: testPass}})
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
        var testUser = "testUser";
        var testEmail = "testUser@ic.ac.uk";
        var testPass = "testPass";

        var user1 = new User({local: {username: testUser, email: testEmail, password: testPass}});
        user1.save(function(err, userDoc) {
            if (err) return done(err);
            else {
                request(app)
                    .get('/api/users/' + userDoc._id)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) return done(err);
                        else {
                            res.body.local.username.should.equal(testUser);
                            return done();
                        }
                    })
            }
        })
    });

    it("should return an error message if a get is queried for a user that does not exist", function(done) {
        var userId = mongoose.Types.ObjectId('000000000000');
        request(app)
            .get('/api/users/' + userId)
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
        var testPass = "testPass";
        var testEmail = "testUser@ic.ac.uk";
        var testUserObj = new User({local: {username: testUser, password: testPass, email: testEmail}});
        testUserObj.save(function (err, user) {
            if (err) {
                return done(err);
            } else {
                request(app)
                    .delete('/api/users/' + user._id)
                    .expect(200)
                    .end(function (err) {
                        if (err) {
                            return done(err);
                        } else {
                            User.findOne({'local.username': testUser}, function (err, user) {
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
        var testId = mongoose.Types.ObjectId('000000000000');
        request(app)
            .delete('/api/users/' + testId)
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
