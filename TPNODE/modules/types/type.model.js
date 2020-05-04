const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TypeSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    realName: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: false,
    },

});

mongoose.model('Type', TypeSchema);
module.exports = TypeSchema;
