/**
 * Created by utsavtiwary on 15/04/16.
 */

var request = require("supertest");
var should = require("should");

var app = require('../../config/express');
var utils = require('../utils');
var mongoose = require('mongoose');

var Article = require('../../app/models/article.server.model');
var User = require('../../app/models/user.server.model');

describe('GET articles', function() {
    var reqUrl = '/api/articles';

    it('should return empty JSON array on startup', function(done) {
        request(app)
            .get(reqUrl)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                } else {
                    res.body.length.should.equal(0);
                    return done();
                }
            })
    });

    it('should return a populated list of articles if articles exist in DB', function(done) {
        var testArtDesc = "An article added for the purpose of testing";
        var testArtURL = "www.testArticle.com/test";

        var user = "testUser";
        var testEmail = "testUser@ic.ac.uk";
        var testPass = "testPass";

        var testUser = new User({local:{username: user, email: testEmail, password: testPass}});

        testUser.save(function(err, userDoc) {
            var testArticle = new Article({description: testArtDesc, url: testArtURL, user: userDoc._id});
            testArticle.save(function(){
                request(app)
                    .get(reqUrl)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            return done(err)
                        } else {
                            res.body.length.should.equal(1);
                            var article = res.body[0];
                            article.description.should.equal(testArtDesc);
                            article.url.should.equal(testArtURL);
                            article.user._id.should.equal(userDoc._id.toString());
                            return done();
                        }
                    })
            })
        })
    });

});

describe('POST article', function() {
    var reqUrl = '/api/articles';

    it('should post an appropriate article to the database upon request', function(done) {
        var testDesc = "An article being posted for testing";
        var testURL = "www.testUrl.com/testing";

        var user = "testUser";
        var testEmail = "testUser@ic.ac.uk";
        var testPass = "testPass";

        var testUser = new User({local:{username: user, email: testEmail, password: testPass}});

        testUser.save(function(err, userDoc) {
                request(app)
                    .post(reqUrl)
                    .send({description: testDesc, url: testURL, user: userDoc._id})
                    .expect(200)
                    .end(function(err) {
                        if (err) {
                            return done(err);
                        } else {
                            Article.findOne({description: testDesc, url: testURL, user: userDoc._id}, function(err, article) {
                                if (err) {
                                    return done(err);
                                } else {
                                    should.exist(article);
                                    return done();
                                }
                            })
                        }
                    })
            });
    });

    it('should post multiple articles to the server', function(done) {

        var testDesc1 = "The first article's desc";
        var testURL1 = "www.testURL1.com";

        var testDesc2 = "The second article's desc";
        var testURL2 = "www.testURL2.com";

        var user = "testUser";
        var testEmail = "testUser@ic.ac.uk";
        var testPass = "testPass";

        var testUser = new User({local:{username: user, email: testEmail, password: testPass}});

        testUser.save(function(err, userDoc){
                if (err) return done(err);
                else{
                    request(app)
                        .post(reqUrl)
                        .send({description: testDesc1, url: testURL1, user: userDoc._id})
                        .expect(200)
                        .end(function(err) {
                            if (err) return done(err);
                            else{
                                request(app)
                                    .post(reqUrl)
                                    .send({description: testDesc2, url: testURL2, user: userDoc._id})
                                    .expect(200)
                                    .end(function(err) {
                                        if (err) return done(err);
                                        else {
                                            Article.findOne({description: testDesc1, url: testURL1, user: userDoc._id},
                                                function(err, article1) {
                                                    if (err) return done(err);
                                                    else {
                                                        should.exist(article1);
                                                        Article.findOne({description: testDesc2, url: testURL2, user: userDoc._id},
                                                            function(err, article2) {
                                                                if (err) return done(err);
                                                                else {
                                                                    should.exist(article2);
                                                                    return done();
                                                                }
                                                            })
                                                    }
                                                })
                                        }
                                    })
                            }
                        })
                }
            })
    });

    it('should not post an article to the server if the user is not in the database', function(done) {
        var user = mongoose.Types.ObjectId('000000000000');
        var testDesc = "The test article's desc";
        var testURL = "www.testURL.com";

        request(app)
            .post(reqUrl)
            .send({description: testDesc, url: testURL, user: user})
            .expect(400)
            .end(function(err, res) {
                if (err) return done(err);
                else {
                    should.exist(res.body.message);
                    res.body.message.should.equal("This user does not exist. The article cannot be shared.");
                    return done();
                }
            })
    });

    it('should push the article\'s id to the appropriate user\'s list of articles', function(done) {
        var user = "testUser";
        var testEmail = "testUser@ic.ac.uk";
        var testPass = "testPass";

        var testUser = new User({local:{username: user, email: testEmail, password: testPass}});

        var testDesc = "The test article's desc";
        var testURL = "www.testURL.com";

        testUser.save(function(err, userDoc){
            if (err) return done(err);
            else {
                request(app)
                    .post(reqUrl)
                    .send({description: testDesc, url: testURL, user: userDoc._id})
                    .expect(200)
                    .end(function (err) {
                        if (err) return done(err);
                        else {
                            User.findById(userDoc._id)
                                .populate('articles')
                                .exec(function(err, userDoc) {
                                    if (err) return done(err);
                                    else {
                                        var article = userDoc.articles[0];
                                        should.exist(article);
                                        article.description.should.equal(testDesc);
                                        article.url.should.equal(testURL);
                                        return done();
                                    }
                                })
                        }
                    })
            }
        })
    })
});

describe('POST articles/:articleId/votes', function() {
    var testId = "";

    var userId = "";
    var voter1 = "";
    var voter2 = "";

    beforeEach(function(done) {
        var user = "testUser";
        var testEmail = "testUser@ic.ac.uk";
        var testPass = "testPass";

        var testDesc = "Description for a test article";
        var testURL = "www.testUrl.com";
        var userIdTest = mongoose.Types.ObjectId('000000000000');

        var testArticle = new Article({description: testDesc, url: testURL, user: userIdTest});

        testArticle.save(function(err, article) {
            if (err) return done(err);
            else {
                testId = article.id;
                var testUser = new User({local:{username: user, email: testEmail, password: testPass}, articles:[testId]});
                var voter1Desc = new User({local:{username: "voter1", email: "voter1@ic.ac.uk", password:"pass"}});
                var voter2Desc = new User({local:{username: "voter2", email: "voter2@ic.ac.uk", password:"pass"}});
                testUser.save(function(err, userDoc) {
                    if (err) return done(err);
                    else {
                        userId = userDoc._id;
                        voter1Desc.save(function(err, voter1Doc) {
                            if (err) return done(err);
                            else {
                                voter1 = voter1Doc._id;
                                voter2Desc.save(function(err, voter2Doc) {
                                    if (err) return done(err);
                                    voter2 = voter2Doc._id;
                                    done();
                                })
                            }
                        })
                    }
                });
            }
        })
    });

    it('should post an appropriate user to the list of up voters', function(done) {
        Article.findById(testId, function(err, article1) {
            if (err) return done(err);
            else {
                request(app)
                    .post('/api/articles/'+ article1.id + '/votes/up/')
                    .send({user: voter1})
                    .expect(200)
                    .end(function(err) {
                        if (err) return done(err);
                        else {
                            Article.findById(article1.id, function(err, article) {
                                if (err) return done(err);
                                else {
                                    var upVoters = article.votes.upVoters;
                                    upVoters[0].should.equal(voter1.toString());
                                    return done();
                                }
                            })
                        }
                    })
            }
        })
    });

    it('should post an appropriate user to the list of down voters', function(done) {
        Article.findById(testId, function(err, article1) {
            if (err) return done(err);
            else {
                request(app)
                    .post('/api/articles/'+ article1.id + '/votes/down/')
                    .send({user: voter1})
                    .expect(200)
                    .end(function(err) {
                        if (err) return done(err);
                        else {
                            Article.findById(article1.id, function(err, article) {
                                if (err) return done(err);
                                else {
                                    var downVoters = article.votes.downVoters;
                                    downVoters[0].should.equal(voter1.toString());
                                    return done();
                                }
                            })
                        }
                    })
            }
        })
    });

    it('should return an error message if the article does not exist', function(done) {
        Article.findByIdAndRemove(testId, function(err, article) {
            request(app)
                .post('/api/articles/'+ article.id + '/votes/down/')
                .send({user: voter1})
                .expect(400)
                .end(function(err, res) {
                    if (err) return done(err);
                    else {
                        should.exist(res.body.message);
                        res.body.message.should.equal("This article doesn't exist.");
                        return done(err);
                    }
                })
        });
    });

    it('should not allow duplicate postings of users to list of voters', function(done) {
        Article.findByIdAndUpdate(testId, {$push: {"votes.upVoters": voter1}}, function(err, article) {
            if (err) return done(err);
            else {
                request(app)
                    .post('/api/articles/' + article.id + '/votes/up')
                    .send({user: voter1})
                    .expect(400)
                    .end(function(err, res) {
                        if (err) return done(err);
                        else {
                            should.exist(res.body.message);
                            res.body.message.should.equal("User has already cast a vote.");
                            return done();
                        }
                    })
            }
        })
    });

    it('should not allow duplicate postings of users to list of voters when user has voted in different category', function(done) {
        Article.findByIdAndUpdate(testId, {$push: {"votes.upVoters": voter1}}, function(err, article) {
            if (err) return done(err);
            else {
                request(app)
                    .post('/api/articles/' + article.id + '/votes/down')
                    .send({user: voter1})
                    .expect(400)
                    .end(function(err, res) {
                        if (err) return done(err);
                        else {
                            should.exist(res.body.message);
                            res.body.message.should.equal("User has already cast a vote.");
                            return done();
                        }
                    })
            }
        })
    })
});
