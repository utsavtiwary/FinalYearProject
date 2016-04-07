/**
 * Created by utsavtiwary on 07/04/16.
 */

var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function() {
    var db = mongoose.connect(config.db);

    return db;
};