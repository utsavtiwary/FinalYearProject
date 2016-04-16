/**
 * Created by utsavtiwary on 15/04/16.
 */
var Article = require('../models/article.server.model');
var User = require('../models/user.server.model');

module.exports = function(app) {

    app.get('/api/articles', function(req, res, next) {
        Article.find({}, function(err, articles) {
            if (err) return next(err);
            else {
                res.send(articles);
            }
        })
    });

    app.post('/api/articles', function(req, res, next) {
        var username = req.body.user;
        User.findOne({_id: username}, function(err, user) {
            if (err) return next(err);
            else {
                if (user) {
                    var article = new Article(req.body);

                    article.save(function(err) {
                        if (err) return next(err);
                        else {
                            User.findByIdAndUpdate(username, {$push: {"articles": article.id}}, function(err) {
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
        var voteProperty = req.params.voteType + "Voters";
        Article.findById(req.params.articleId, function(err, article) {
                if (err) return next(err);
                else {
                    if(article) {
                        var listVoters = article.votes[voteProperty];
                        var equalUser = listVoters.map(function(item) {
                            return item === req.body.user;
                        });
                        if (equalUser.indexOf(true) == -1) {
                            article.votes[voteProperty].push(req.body.user);
                            var updatedArticle = new Article(article);
                            updatedArticle.save(function (err, article) {
                                if (err) return next(err);
                                else {
                                    res.status(200).end();
                                }
                            });
                        }
                        else {
                            res.status(400).send({message: "The voter is already in the list of " + voteProperty});
                        }
                    } else {
                        res.status(400).send({message: "This article doesn't exist."});
                    }
                }
            })
    })
};