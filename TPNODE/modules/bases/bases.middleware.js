const mongoose = require('mongoose');
const Base = mongoose.model('Base');
const Type = mongoose.model('Type');
const Table = mongoose.model('Table');
const Column = mongoose.model('Column');

module.exports = {

    getBases: function (req, res, next) {
        Base.find().populate().exec(function (err, bases) {
            if (err) {
                return next({
                    message: "Les bases n'ont pas pu etre envoyés."
                });
            }
            res.send(bases);
        });
    },

    addColumn: function (req, res, next) {
        var type = Type.find({ _id: req.body.type }).exec(function(err, bases) {
            if (err) {
                return next({
                    status: 404,
                    message: "Type de colonne incorrect."
                });
            }
            if (bases.length !== 1) {
                return next({
                    status: 404,
                    message: "base introuvable"
                })
            }
            req.data.base = bases[0];
        });
        console.log(type.name);
        /*
        const column = new Column({
            name: req.body.name,
            type: req.body.type,
        });

        type.save(function(err, typeSaved) {
            if (err) {
                return next({
                    message: "Le type de colonne n'a pas pu etre ajouté"
                });
            }
            res.send(typeSaved);
        });

         */
    },

    baseIdParam: function (req, res, next, id) {
        Base.find({"_id": id}).populate('tables').exec(function(err, bases) {
            if (err) {
                return next({
                    status: 404,
                    message: "La base n'a pas pu etre récupéré."
                });
            }
            if (bases.length !== 1) {
                return next({
                    status: 404,
                    message: "base introuvable"
                })
            }
            req.data.base = bases[0];
            next();
        });
    },

    tableIdParam: function (req, res, next, id) {
        Table.find({"_id": id}).populate('columns').exec(function(err, table) {
            if (err) {
                return next({
                    status: 404,
                    message: "La table n'a pas pu être récupérée."
                });
            }
            if (table.length !== 1) {
                return next({
                    status: 404,
                    message: "table introuvable"
                })
            }
            req.data.table = table[0];
            next();
        });
    },

    getBase: function (req, res) {
        res.send({base: req.data.base});
    },

    getTable: function(req, res) {
        res.send({
            base: req.data.base,
            table: req.data.table,
        });
    },

    addTable: function (req, res, next) {
        const table = new Table({
            name: req.body.name,
        });
        table.save(function(err, tableSaved) {
            if (err) {
                return next({
                    message: "La table n'a pas pu etre ajouté"
                });
            }
            req.data.base.tables.push(tableSaved);
            req.data.base.save(function(err, baseUpdated) {
                if (err) {
                    return next({
                        message: "La table à été créée mais n'a pas pu être ajoutée à la base",
                    });
                }
                res.send(tableSaved);
            });
        });
    },

    updateBase: function (req, res, next) {
        if (req.body.name) req.data.base.name = req.body.name;
        if (req.body.tables) req.data.base.tables = req.body.tables;
        console.log(req.body.base);


        req.data.base.save(function (err, baseUpdate) {
            if (err) {
                return next({
                    message: "Impossible de maj la base"
                });
            }
            req.data.base = baseUpdate;
            next();
        });
    },

    deleteBase: function (req, res, next) {
        req.data.base.tables.forEach(item => {
           item.remove(function(err, itemRemoved) {
               if (err) {
                   return next({
                       message: "La base n'a pas pu etre supprimé."
                   });
               }
               req.data.base.remove(function(err, baseRemoved) {
                   if (err) {
                       return next({
                           message: "La base n'a pas pu etre supprimé."
                       });
                   }
                   res.send({success: 1});
               });
           });
        });
    },

    newBase: function (req, res, next) {
        const base = new Base({
            name: req.body.name,
            tables: [],
        });
        base.save(function(err, baseSaved) {
            if (err) {
                return next({
                    message: "La base n'a pas pu etre ajouté"
                });
            }
            res.send(baseSaved);
        });
    },
};
