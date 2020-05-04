const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PostSchema = new Schema({

    title: {
        type: String,
        required: true
    },

    body: {
        type: String,
        required: true
    }

});

mongoose.model('Post', PostSchema);
module.exports = PostSchema;
