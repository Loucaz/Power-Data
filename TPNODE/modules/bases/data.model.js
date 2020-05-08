const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DataSchema = new Schema({

    value: {
      type: String,
      required: true
    },

    valueString: {
        type: String,
        required: false
    },

    valueNumber: {
        type: Number,
        required: false
    },

    valueDate: {
        type: Date,
        required: false
    },

    valueBoolean: {
        type: Boolean,
        required: false
    },

    line: {
        type: Number,
        required: true
    },

    column: {
        type: Schema.Types.ObjectId,
        ref: "Column",
        required: true
    },


});

mongoose.model('Data', DataSchema);
module.exports = DataSchema;
