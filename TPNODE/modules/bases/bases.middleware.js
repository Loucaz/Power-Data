const mongoose = require('mongoose');
const Base = mongoose.model('Base');
const Type = mongoose.model('Type');
const Table = mongoose.model('Table');
const Column = mongoose.model('Column');
const Data = mongoose.model('Data');
const Line = mongoose.model('Line');


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
        Type.findOne({realName: req.body.type }).exec(function(err, typeFind) {
            if (err) {
                return next({
                    status: 404,
                    message: "Type de colonne incorrect."
                });
            } else {
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

                c.save(function(err, columnSaved) {
                    if (err) {
                        return next({
                            message: "La colonne n'a pas pu etre ajouté"
                        });
                    }
                    req.data.table.columns.push(columnSaved);
                    req.data.table.save(function(err, tableUpdated) {
                        if (err) {
                            return next({
                                message: "La colonne à été créée mais n'a pas pu être ajoutée à la table",
                            });
                        }
                        res.send(columnSaved);
                    });
                });
            }
        });
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
        Table
            .find({"_id": id})
            .populate([{
                path: 'lines',
                populate: {
                    path: 'data',
                    model: 'Data'
                }
            },{
                path: 'columns',
                populate: {
                    path: 'type',
                    model: 'Type'
                }
            }])
            .exec(function(err, table) {
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

    setLine: function(req, res, next) {

        var asyncForeach = function asyncForeach(req, res) {
            return new Promise(function(resolve, reject) {
                let table = req.data.table;
                req.data.line = 1;
                var index = 0;

                if(table.lines.length == 0) resolve(req.data.line);
                table.lines.forEach(function(e) {
                    Line.find({ _id: e }).populate().exec(function (err, d) {
                        req.data.line = (d[0].number >= req.data.line) ? d[0].number + 1 : req.data.line;
                        index++;
                        if(index >= table.lines.length) resolve(req.data.line);
                    });
                })
            })
        };

        asyncForeach(req, res).then(function(x) {
            req.data.line = x;
            console.log("GO NEXT WITH NUMBER LINE " + req.data.line);
            next();
        });
    },

    testValidity: function(req, res, next) {
        var asyncTask = function asyncTask(req, res, next) {
            return new Promise(function(resolve, reject) {
                var index = 0;
                var errorMessages = [];
                if(req.body.datas.length == 0) resolve(errorMessages);
                req.body.datas.forEach(function(e) {
                    if(e.column == null) {
                        errorMessages.push({column: null, message: "Donnée non valide."});
                        index++;
                    }
                    else {
                        Column
                            .findOne({ _id: e.column })
                            .populate('type')
                            .exec(function (err, column) {
                            if(err) {
                                index++;
                                errorMessages.push({column: column.name, message: "Colonne non valide."});
                            }
                            else {
                                index++;
                                if(!column.nullable && (e.value == null || e.value.length == 0)) errorMessages.push({column: column.name, message: "La donnée ne peut être vide."});
                                else {
                                    switch(column.type.realName) {
                                        case 'longtext':
                                        case 'shorttext':
                                            if(e.value != null && column.min != null && e.value.length < column.min) errorMessages.push({column: column.name, message: "La donnée doit avoir au moins " + column.min + " caractères."});
                                            if(e.value != null && column.max != null && e.value.length > column.max) errorMessages.push({column: column.name, message: "La donnée doit avoir au plus " + column.max + " caractères."});
                                            break;
                                        case 'number':
                                            if(!column.nullable && e.valueNumber == null) errorMessages.push({column: column.name, message: "La donnée envoyée n'est pas valide."});
                                            else {
                                                if(e.valueNumber != null && column.min != null && e.valueNumber < column.min) errorMessages.push({column: column.name, message: "La donnée ne peut pas être inferieure à " + column.min + "."});
                                                if(e.valueNumber != null && column.max != null && e.valueNumber > column.max) errorMessages.push({column: column.name, message: "La donnée ne peut pas être supérieure à " + column.max + "."});
                                            }
                                            break;
                                        case 'date':
                                            if(column.dateIsToday) {
                                                e.valueDate = new Date();
                                                e.value = e.valueDate;
                                            } else {
                                                if(!column.dateIsFree && column.dateStart != null && column.valueDate != null) {
                                                    if(e.valueDate == null || e.valueDate.getTime() < column.dateStart.getTime()) errorMessages.push({column: column.name, message: "La donnée ne peut pas être inférieure à " + column.dateStart + "."});
                                                }
                                                if(!column.dateIsFree && column.dateEnd != null && column.valueDate != null) {
                                                    if(e.valueDate == null || e.valueDate.getTime() > column.dateEnd.getTime()) errorMessages.push({column: column.name, message: "La donnée ne peut pas être supérieure à " + column.dateStart + "."});
                                                }
                                            }
                                            break;
                                        case 'boolean':
                                            if (e.valueBoolean !== true && e.valueBoolean !== false && !column.nullable) errorMessages.push({column: column.name, message: "Type de donnée invalide."});
                                            break;
                                        default:
                                            errorMessages.push({column: column.name, message: "Le type de colonne n'est pas valide." + column.type.realName});
                                            break;

                                    }
                                }
                            }
                            if(index >= req.body.datas.length) resolve(errorMessages);
                        });
                    }
                    if(index >= req.body.datas.length) resolve(errorMessages);
                });
            })
        };

        asyncTask(req, res, next).then(function(errorMessages) {
            if(errorMessages.length > 0) {
                return next({
                    status: 500,
                    message:errorMessages
                });
            }
            next();
        });

    },

    addDataline: function(req, res, next) {

        console.log("ADD LINE, number : " + req.data.line);

        var asyncForeach = function asyncForeach(req, res, next) {
            return new Promise(function(resolve, reject) {
                var iterator = 0;
                console.log(req.body.datas);
                let line = new Line({
                    number: req.data.line,
                    data: [],
                });
                line.save(function (err, lineSaved) {
                    if (err) {
                        console.log("ERROR LINE CREATION " + lineSaved);
                        return next({
                            status: 500,
                            message: "cannot create line"
                        });
                    }
                    req.body.datas.forEach(function (e) {
                        let data = new Data({
                            valueString: e.valueString,
                            valueNumber: e.valueNumber,
                            valueBoolean: e.valueBoolean,
                            valueDate: e.valueDate,
                            value: e.value,
                            column: e.column,
                        });
                        console.log("CREATE DATA  " + data.value);
                        data.save(function (err, dataSaved) {
                            if (err) {
                                console.log("ERROR DATA SAVE " + data.value);
                                return next({
                                    status: 500,
                                    message: "cannot save data"
                                });
                            }
                            lineSaved.data.push(dataSaved);
                            console.log("DATA SAVE " + data.value + ", iterator : "+ iterator +",length : " + req.body.datas.length);
                            iterator++;
                            if(iterator >= req.body.datas.length) {
                                console.log("ALL DATA CREATED AND PUSH ON " + lineSaved);
                                resolve(lineSaved);
                            }
                        });
                    })
                });
            })
        };

        asyncForeach(req, res, next).then(function(lineSaved) {
            console.log("END DATA CREATE GO SAVE LINE");

            lineSaved.save(function (err, lineUpdated) {
                if (err) {
                    console.log("ERROR SAVE LINE");
                    return next({
                        status: 500,
                        message: "cannot save line"
                    });
                }
                console.log("LINE SAVED");
                req.data.table.lines.push(lineUpdated);
                req.data.table.save(function (err, tableUpdated) {
                    if (err) {
                        console.log("ERROR SAVE TABLE");
                        return next({
                            status: 500,
                            message: "cannot save the table"
                        });
                    }
                    console.log("TABLE SAVED");
                    res.send(tableUpdated);
                });
            });
        });
    },

    getData: function(req, res, next) {
        Data.find().populate().exec(function (err, bases) {
            if (err) {
                return next({
                    message: "Les bases n'ont pas pu etre envoyés."
                });
            }
            res.send(bases);
        });
    },


    addData: function(req, res, next) {
        /*
        var data = new Data({
            valueString: req.body.valueString,
            valueNumber: req.body.valueNumber,
            valueBoolean: req.body.valueBoolean,
            valueData: req.body.valueData,
            value: req.body.value,
            column: req.body.column,
            line: req.body.line,
        });

        data.save(function(err, dataSaved) {
            if (err) {
                return next({
                    message: "La donnée n'a pas pu etre ajouté"
                });
            }
            req.data.table.data.push(dataSaved);
            req.data.table.save(function(err, tableUpdated) {
                if (err) {
                    return next({
                        message: "La donnée à été créée mais n'a pas pu être ajoutée à la table",
                    });
                }
                res.send(dataSaved);
            });
        });
         */
    },
};
