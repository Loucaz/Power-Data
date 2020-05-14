const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TableSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    columns: [{
        type: Schema.Types.ObjectId,
        ref: "Column",
        required: false
    }],

    lines: [{
        type: Schema.Types.ObjectId,
        ref: "Line",
        required: false
    }],

});

mongoose.model('Table', TableSchema);
module.exports = TableSchema;
