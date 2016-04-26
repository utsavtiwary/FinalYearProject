/**
 * Created by utsavtiwary on 08/04/16.
 */
var User = require('../models/user.server.model');

module.exports = function(app, passport) {

    app.get('/api/users', function(req, res, next) {
        User.find({}, function(err, users) {
            if (err) {
                return next(err);
            } else {
                res.send(users);
            }
        })
    });

    app.post('/api/users', function(req, res, next) {
        var username = req.body.username;
        User.findOne({'local.username': username}, function(err, user){
            if (err) {
                return next(err);
            } else {
                if (user) {
                    res.status(400).send({message: "This username is already in use"});
                } else {
                    User.findOne({'local.email': req.body.email}, function(err, user) {
                        if (err) return next(err);
                        else {
                            if (user) {
                                res.status(400).send({message: "This email has already been registered"});
                            } else {
                                var newUser = new User();
                                newUser.local.email = req.body.email;
                                newUser.local.username = req.body.username;
                                newUser.local.password = newUser.generateHash(req.body.password);
                                newUser.save(function(err) {
                                    if (err) return next(err);
                                    else {
                                        res.status(200).end();
                                    }
                                })
                            }
                        }
                    });
                }
            }
        });
    });

    app.post('/login', passport.authenticate('local', {failureFlash: true})
    , function(req, res) {
            res.end();
        });

    app.get('/currentUser', function(req, res) {
        res.send(req.user);
    });

    app.get('/logout', function(req, res) {
        console.log(req.user);
        req.logout();
        res.end();
    });

    app.get('/api/users/:userId', function(req, res, next) {
        User.findById(req.params.userId, function(err, user) {
            if (err) return next(err);
            else {
                if (user) {
                    res.send(user);
                } else {
                    res.status(400).send({message: "This user does not exist."});
                }
            }
        })
    });

    app.delete('/api/users/:userId', function(req, res, next) {

        User.findOneAndRemove({_id: req.params.userId}, function(err, user) {
            if (err) {
                return next(err);
            } else {
                if (user) {
                    res.status(200).end();
                }
                else {
                    res.status(400).send({message: "This user doesn't exist or has already been deleted"});
                }
            }
        })
    });
};