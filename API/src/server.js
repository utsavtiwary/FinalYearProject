/**
 * Created by utsavtiwary on 07/04/16.
 */

var config = require('./config/config'),
    mongoose = require('./config/mongoose'),
    express = require('./config/express'),
    http = require('http');


var db = mongoose();
var app = express();

var server = http.createServer(app);

server.listen(config.port);

module.exports = server;
console.log('server running at http://localhost:' + config.port);