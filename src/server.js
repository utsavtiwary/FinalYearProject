/**
 * Created by utsavtiwary on 07/04/16.
 */

// modules =================================================

var app            = require('./config/express');
var mongoose       = require('mongoose');

// configuration ===========================================

var port = process.env.PORT || 8080;

var db = require('./config/db');
mongoose.connect(db.url_server);

// start app ===============================================

app.listen(port);
console.log('Server running on port: ' + port);