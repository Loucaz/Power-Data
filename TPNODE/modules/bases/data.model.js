const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DataSchema = new Schema({

    value: {
      type: String,
      required: false
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

    valueObjectId: [{
        type: Schema.Types.ObjectId,
        required: false
    }],

    column: {
        type: Schema.Types.ObjectId,
        ref: "Column",
        required: true
    },


});

mongoose.model('Data', DataSchema);
module.exports = DataSchema;
