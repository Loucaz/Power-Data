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
        console.log("Requete ajout colonne");
        console.log(req.body.type);
        Type.findOne({realName: req.body.type }).exec(function(err, typeFind) {
            if (err) {
                return next({
                    status: 404,
                    message: "Type de colonne incorrect."
                });
            } else {
                console.log('Type trouvé : ' + typeFind.realName);
                var c = new Column();
                switch (typeFind.realName) {
                    case 'number':
                        c = new Column({
                            name: req.body.name,
                            type: typeFind,
                            min: (req.body.min == null) ? -99999999999999999 : req.body.min,
                            max: (req.body.max == null) ? 9999999999999999999 : req.body.max,
                            numberStepValue: (req.body.numberStepValue == null) ? 0.001 : req.body.numberStepValue,
                            nullable: req.body.nullable,
                        });
                        if(c.min > c.max) {
                            let tmp = c.min;
                            c.min = c.max;
                            c.max = tmp;
                        }
                        break;
                    case 'shorttext':
                        c = new Column({
                            name: req.body.name,
                            type: typeFind,
                            min: (req.body.min == null) ? 0 : req.body.min,
                            max: (req.body.max == null) ? 255 : req.body.max,
                            defaultStringValue: (req.body.defaultStringValue == null) ? '' : req.body.defaultStringValue,
                            nullable: req.body.nullable,
                        });
                        break;
                    case 'longtext':
                        c = new Column({
                            name: req.body.name,
                            type: typeFind,
                            min: (req.body.min == null) ? 0 : req.body.min,
                            max: (req.body.max == null) ? 2500 : req.body.max,
                            defaultStringValue: (req.body.defaultStringValue == null) ? '' : req.body.defaultStringValue,
                            nullable: req.body.nullable,
                        });
                        break;
                    case 'boolean':
                        c = new Column({
                            name: req.body.name,
                            type: typeFind,
                            nullable: req.body.nullable,
                        });
                        break;
                    case 'date':
                        c = new Column({
                            name: req.body.name,
                            type: typeFind,
                            dateStart: req.body.dateStart,
                            dateEnd: req.body.dateEnd,
                            dateIsToday: (req.body.dateIsToday == null) ? false : req.body.dateIsToday,
                            dateIsFree: (req.body.dateIsFree == null) ? false : req.body.dateIsFree,
                            nullable: req.body.nullable,
                        });
                        break;
                    default:
                        break;
                }

                console.log('Colonne créé : ' + c);
                c.save(function(err, columnSaved) {
                    if (err) {
                        console.log('Colonne non sauvegardée');
                        console.log('Erreur : ' + err.toString());
                        return next({
                            message: "La colonne n'a pas pu etre ajouté"
                        });
                    }
                    console.log('Colonne sauvegardée : ' + columnSaved);
                    req.data.table.columns.push(columnSaved);
                    req.data.table.save(function(err, tableUpdated) {
                        if (err) {
                            return next({
                                message: "La colonne à été créée mais n'a pas pu être ajoutée à la table",
                            });
                        }
                        console.log('Table modifiée : ' + tableUpdated);
                        res.send(columnSaved);
                    });
                });
            }
        });

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
