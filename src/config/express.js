/**
 * Created by utsavtiwary on 09/04/16.
 */

// modules =================================================

var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

// configuration ===========================================

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(methodOverride('X-HTTP-Method-Override'));

// routes ==================================================
require('../app/routes')(app); // configure our routes

// Expose app to tests or server
module.exports = app;