const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LineSchema = new Schema({

    number: {
        type: Number,
        required: true
    },

    data: [{
        type: Schema.Types.ObjectId,
        ref: "Data",
        required: false
    }]

});

mongoose.model('Line', LineSchema);
module.exports = LineSchema;
