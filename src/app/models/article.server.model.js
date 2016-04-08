/**
 * Created by utsavtiwary on 08/04/16.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    user: {
        type: String,
        ref: 'User'
    }
});

module.exports = mongoose.model('Article', articleSchema);