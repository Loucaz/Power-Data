const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    binome: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

});

mongoose.model('User', UserSchema);
module.exports = UserSchema;