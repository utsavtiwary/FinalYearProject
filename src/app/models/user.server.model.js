/**
 * Created by utsavtiwary on 08/04/16.
 */

var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
    local: {
        username: String,
        email: String,
        password: String
    },
    articles: {
        type: [{type: Schema.Types.ObjectId, ref:'Article'}],
        default: []
    }
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
