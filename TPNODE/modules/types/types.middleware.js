const mongoose = require('mongoose');
const Type = mongoose.model('Type');

module.exports = {

    getTypes: function (req, res, next) {
        Type.find().populate().exec(function (err, types) {
            if (err) {
                return next({
                    message: "Les types n'ont pas pu etre envoyés."
                });
            }
            res.send(types);
        });
    },

    addType: function (req, res, next) {
        const type = new Type({
            name: req.body.name,
            realName: req.body.realName,
            description: req.body.description,
        });
        type.save(function(err, typeSaved) {
            if (err) {
                return next({
                    message: "Le type de colonne n'a pas pu etre ajouté"
                });
            }
            res.send(typeSaved);
        });
    },

};
