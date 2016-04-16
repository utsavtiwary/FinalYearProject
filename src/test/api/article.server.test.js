/**
 * Created by utsavtiwary on 15/04/16.
 */

var request = require("supertest");
var should = require("should");

var app = require('../../config/express');
var utils = require('../utils');

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
        var username = "testUser";

        var testUser = new User({_id: username});
        var testArticle = new Article({description: testArtDesc, url: testArtURL, user: username});

        testUser.save()
            .then(testArticle.save())
            .then(function(){
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
                            article.user.should.equal(username);
                            return done();
                        }
                    })
            })

    });

});

describe('POST article', function() {
    var reqUrl = '/api/articles'

    it('should post an appropriate article to the database upon request', function(done) {
        var testDesc = "An article being posted for testing";
        var testURL = "www.testUrl.com/testing";
        var user = "testUser";
        var testUser = new User({_id: user});
        testUser.save()
            .then(function() {
                request(app)
                    .post(reqUrl)
                    .send({description: testDesc, url: testURL, user: user})
                    .expect(200)
                    .end(function(err) {
                        if (err) {
                            return done(err);
                        } else {
                            Article.findOne({description: testDesc, url: testURL, user: user}, function(err, article) {
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
        var user = "testUser";

        var testDesc1 = "The first article's desc";
        var testURL1 = "www.testURL1.com";

        var testDesc2 = "The second article's desc";
        var testURL2 = "www.testURL2.com";

        var testUser = new User({_id: user});

        testUser.save(function(err){
                if (err) return done(err);
                else{
                    request(app)
                        .post(reqUrl)
                        .send({description: testDesc1, url: testURL1, user: user})
                        .expect(200)
                        .end(function(err) {
                            if (err) return done(err);
                            else{
                                request(app)
                                    .post(reqUrl)
                                    .send({description: testDesc2, url: testURL2, user: user})
                                    .expect(200)
                                    .end(function(err) {
                                        if (err) return done(err);
                                        else {
                                            Article.findOne({description: testDesc1, url: testURL1, user: user},
                                                function(err, article1) {
                                                    if (err) return done(err);
                                                    else {
                                                        should.exist(article1);
                                                        Article.findOne({description: testDesc2, url: testURL2, user: user},
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
        var user = "testUser";
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
                    res.body.message.should.equal("This user does not exist. The article cannot be shared.")
                    return done();
                }
            })
    });

    it('should push the article\'s id to the appropriate user\'s list of articles', function(done) {
        var user = "testUser";
        var testDesc = "The test article's desc";
        var testURL = "www.testURL.com";

        var testUser = new User({_id: user});
        testUser.save(function(err){
            if (err) return done(err);
            else {
                request(app)
                    .post(reqUrl)
                    .send({description: testDesc, url: testURL, user: user})
                    .expect(200)
                    .end(function (err) {
                        if (err) return done(err);
                        else {
                            User.findById(user)
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
    beforeEach(function(done) {
        var username = "testUser";
        var testDesc = "Description for a test article";
        var testURL = "www.testUrl.com";

        var testArticle = new Article({description: testDesc, url: testURL, user: username});

        testArticle.save(function(err, article) {
            if (err) return done(err);
            else {
                testId = article.id
                var testUser = new User({_id: username, articles:[testId]});
                testUser.save(done);
            }
        })
    });

    it('should post an appropriate user to the list of up voters', function(done) {
        Article.findById(testId, function(err, article1) {
            if (err) return done(err);
            else {
                request(app)
                    .post('/api/articles/'+ article1.id + '/votes/up/')
                    .send({user: 'testUser'})
                    .expect(200)
                    .end(function(err) {
                        if (err) return done(err);
                        else {
                            Article.findById(article1.id, function(err, article) {
                                if (err) return done(err);
                                else {
                                    var upVoters = article.votes.upVoters;
                                    upVoters[0].should.equal('testUser');
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
                    .send({user: 'testUser'})
                    .expect(200)
                    .end(function(err) {
                        if (err) return done(err);
                        else {
                            Article.findById(article1.id, function(err, article) {
                                if (err) return done(err);
                                else {
                                    var downVoters = article.votes.downVoters;
                                    downVoters[0].should.equal('testUser');
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
                .send({user: "testUser"})
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
        Article.findByIdAndUpdate(testId, {$push: {"votes.upVoters": 'testUser'}}, function(err, article) {
            if (err) return done(err);
            else {
                request(app)
                    .post('/api/articles/' + article.id + '/votes/up')
                    .send({user: 'testUser'})
                    .expect(400)
                    .end(function(err, res) {
                        if (err) return done(err);
                        else {
                            should.exist(res.body.message);
                            res.body.message.should.equal("The voter is already in the list of upVoters");
                            return done();
                        }
                    })
            }
        })
    })
});
