/**
 * Created by utsavtiwary on 08/04/16.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var articleSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    user: {
        type: String,
        ref: 'User',
        required: true
    },
    votes: {
        type: {
            upVoters: {
                type: [{type: String, ref: 'User'}]
            },
            downVoters: {
                type: [{type: String, ref: 'User'}]
            }
        },
        default: {upVoters: [], downVoters: []}
    }
});

module.exports = mongoose.model('Article', articleSchema);