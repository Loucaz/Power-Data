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

    min: {
        type: Number,
        required: false,
    },

    max: {
        type: Number,
        required: false,
    },

    defaultNumberValue: {
        type: Number,
        required: false,
    },

    defaultStringValue: {
        type: String,
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

    dateIsToday: {
        type: Boolean,
        required: false,
    },

    dateIsFree: {
        type: Boolean,
        required: false,
    },

    dateStart: {
        type: Date,
        required: false,
    },

    dateEnd: {
        type: Date,
        required: false,
    },


});

mongoose.model('Column', ColumnSchema);
module.exports = ColumnSchema;
