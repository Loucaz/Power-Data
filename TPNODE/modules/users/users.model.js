const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({

    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }

});

mongoose.model('User', UserSchema);
module.exports = UserSchema;