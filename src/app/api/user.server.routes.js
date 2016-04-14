/**
 * Created by utsavtiwary on 08/04/16.
 */
var User = require('../models/user.server.model');

module.exports = function(app) {

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
        User.findOne({_id: username}, function(err, user){
            if (err) {
                return next(err);
            } else {
                if (user) {
                    res.status(400).send({message: "This username is already in use"});
                } else {
                    var user = new User({_id: username});
                    user.save(function(err) {
                        if (err) {
                            return next(err);
                        } else {
                            res.status(200).end();
                        }
                    });
                }
            }
        });
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
    })
};