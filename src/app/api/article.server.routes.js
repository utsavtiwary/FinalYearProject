/**
 * Created by utsavtiwary on 15/04/16.
 */
var Article = require('../models/article.server.model');
var User = require('../models/user.server.model');

module.exports = function(app) {

    app.get('/api/articles/limit/:limit', function(req, res, next) {
        var limit = parseInt(req.params.limit);
        Article.aggregate([
                {$project: {
                    upVotes: {$size: '$votes.upVoters'},
                    downVotes: {$size: '$votes.downVoters'},
                    description: 1,
                    url: 1,
                    user: 1,
                    votes: 1
                }},
                {$sort: {
                    upVotes: -1,
                    downVotes: 1
                }},
                {$limit: limit}
            ],
            function(err, result) {
                User.populate(result, {path: "user", select:'local.username'}, function(err) {
                    if (err) return next(err);
                    else {
                        res.send(result);
                    }
                });
            });
    });

    app.get('/api/articles', function(req, res, next) {
        Article.find({}, function(err, articles) {
            if (err)  return next(err);
            else {
                res.send(articles);
            }
        })
    });

    app.post('/api/articles', function(req, res, next) {
        var userId = req.user._id;
        var articleDoc = {description: req.body.description, url: req.body.url, user: userId};
        User.findById(userId, function(err, user) {
            if (err) return next(err);
            else {
                if (user) {
                    var article = new Article(articleDoc);

                    article.save(function(err) {
                        if (err) return next(err);
                        else {
                            User.findByIdAndUpdate(user._id, {$push: {"articles": article.id}}, function(err) {
                                res.status(200).end();
                            });
                        }
                    })
                } else {
                    res.status(400).send({message: "This user does not exist. The article cannot be shared."});
                }
            }
        })
    });

    app.post('/api/articles/:articleId/votes/:voteType/', function(req, res, next) {
        var voteTypes = ["up", "down"];
        var voteType = req.params.voteType;
        var indexOfVoteType = voteTypes.indexOf(voteType);

        var otherVoteProperty = voteTypes[1 - indexOfVoteType] + "Voters";
        var voteProperty = voteType + "Voters";

        Article.findById(req.params.articleId, function(err, article) {
                if (err) return next(err);
                if (article.user.toString() == req.user._id.toString()) {
                    res.status(400).send({message: "User cannot vote on their own articles."})
                }
                else {
                    if (article) {
                        var firstList = article.votes[voteProperty];
                        var secondList = article.votes[otherVoteProperty];

                        function inList(item) {
                            return (item.toString() === req.user._id.toString());
                        }

                        var userInFirstList = firstList.map(inList);
                        var userInSecondList = secondList.map(inList);

                        if (userInSecondList.indexOf(true) != -1) {
                            var indexOfUser = userInSecondList.indexOf(true);
                            article.votes[otherVoteProperty].splice(indexOfUser, 1);
                            article.votes[voteProperty].push(req.user._id);
                            var updatedArticle = new Article(article);
                            updatedArticle.save(function(err) {
                                if (err) return next(err);
                                else {
                                    res.end();
                                }
                            })
                        } else if (userInFirstList.indexOf(true) == -1) {
                            article.votes[voteProperty].push(req.user._id);
                            var updatedArticle = new Article(article);
                            updatedArticle.save(function (err) {
                                if (err) return next(err);
                                else {
                                    res.end();
                                }
                            });
                        }
                        else {
                            res.status(400).send({message: "User has already cast a vote."});
                        }
                    } else {
                        res.status(400).send({message: "This article doesn't exist."});
                    }
                }
            })
    })
};