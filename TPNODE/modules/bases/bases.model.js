const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let BaseSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    tables: [{
        type: Schema.Types.ObjectId,
        ref: "Table",
        required: false
    }],

});

mongoose.model('Base', BaseSchema);
module.exports = BaseSchema;
