/**
 * Created by utsavtiwary on 09/04/16.
 */
var request = require("supertest");
var should = require("should");

var app = require('../../config/express');
var utils = require('../utils');

var User = require('../../app/models/user.server.model');

describe('GET users', function() {
    it("should return empty Json array", function(done){
        request(app)
            .get('/api/users')
            .set('Accept', 'application/json')
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
                throw err;
            } else {
                request(app)
                    .get('/api/users')
                    .set('Accept', 'application/json')
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


