/**
 * Created by utsavtiwary on 08/04/16.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    articles: {
        type: [{type: Schema.Types.ObjectId, ref:'Article'}],
        default: []
    }
});

module.exports = mongoose.model('User', userSchema);
