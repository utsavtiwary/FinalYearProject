/**
 * Created by utsavtiwary on 09/04/16.
 */

// modules =================================================

var express        = require('express');
var app            = express();
var methodOverride = require('method-override');
var passport = require('passport');
var flash    = require('connect-flash');

require('./passport')(passport);

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

// configuration ===========================================

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

// required for passport
app.use(session({ secret: 'iloveicecream', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


app.use(methodOverride('X-HTTP-Method-Override'));

// routes ==================================================
require('../app/routes')(app); // configure our routes

// Expose app to tests or server
module.exports = app;