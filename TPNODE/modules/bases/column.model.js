const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ColumnSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    type: {
      type: Schema.Types.ObjectId,
      ref: "Type",
    },

    minLength: {
        type: Number,
        required: false,
    },

    maxLength: {
        type: Number,
        required: false,
    },

    defaultNumberValue: {
        type: Number,
        required: false,
    },

    defaultStringValue: {
        type: Number,
        required: false,
    },

    numberStepValue: {
        type: Number,
        required: false,
    },

    nullable: {
        type: Boolean,
        required: true,
    },

    // Maximum difference (Days)
    maxDifferenceDate: {
        type: Number,
        required: false,
    },

    dateIsPast: {
        type: Boolean,
        required: false,
    },

    dateIsFuture: {
        type: Boolean,
        required: false,
    },

    dataIsToday: {
        type: Boolean,
        required: false,
    },


});

mongoose.model('Column', ColumnSchema);
module.exports = ColumnSchema;
