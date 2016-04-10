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
        var userData = req.body;
        var user = new User({_id: userData.username});
        user.save(function(err) {
            if (err) {
                return next(err);
            } else {
                res.status(200).end();
            }
        });
    });

    app.delete('/api/users/:userId', function(req, res, next) {
        User.remove({_id: req.params.userId}, function(err) {
            if (err) {
                return next(err);
            } else {
                res.status(200).end();
            }
        })
    })
};