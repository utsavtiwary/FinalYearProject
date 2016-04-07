/**
 * Created by utsavtiwary on 07/04/16.
 */

var express = require('express'),
    bodyParser = require('body-parser');


module.exports = function() {
    var app = express();


    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT");
        next();
    });

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    return app;
};