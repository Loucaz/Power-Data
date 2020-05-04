const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DataSchema = new Schema({

    value: {
        type: [String, Number],
        required: true
    },

    line: {
        type: Number,
        required: true
    },

    column: {
        type: Schema.Types.ObjectId,
        ref: "Column",
    },


});

mongoose.model('Data', DataSchema);
module.exports = DataSchema;
