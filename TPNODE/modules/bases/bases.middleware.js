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
        var asyncTask = function asyncTask(req, res, next) {
            return new Promise(function (resolve, reject) {
                var errorMessages = [];
                console.log(req.data);
                Type.findOne({realName: req.body.type}).exec(function (err, typeFind) {
                    if (err) {
                        errorMessages.push({message: "Type non valide."});
                        resolve(null, errorMessages);
                    } else {
                        var c = new Column();
                        var n = (null === req.body.nullable || undefined === req.body.nullable) ? false : req.body.nullable;
                        var isLabel = (null === req.body.isLabel || undefined === req.body.isLabel) ? false : req.body.isLabel;
                        switch (typeFind.realName) {
                            case 'number':
                                c = new Column({
                                    name: req.body.name,
                                    type: typeFind,
                                    isLabel: isLabel,
                                    min: (req.body.min == null) ? -99999999999999999 : req.body.min,
                                    max: (req.body.max == null) ? 9999999999999999999 : req.body.max,
                                    numberStepValue: (req.body.numberStepValue == null) ? 0.001 : req.body.numberStepValue,
                                    nullable: n,
                                });
                                if (c.min > c.max) {
                                    let tmp = c.min;
                                    c.min = c.max;
                                    c.max = tmp;
                                }
                                resolve(c, errorMessages);
                                break;
                            case 'relation':
                                console.log("TYPE RELATION");
                                if (['one-to-one', 'one-to-many'].indexOf(req.body.relationType) === -1 || req.body.tableReference == null) {
                                    errorMessages.push({message: "Parametres de la relation incorrects."});
                                    resolve(null, errorMessages);
                                } else {
                                    Table.findOne({_id: req.body.tableReference}).exec(function (err, tableFind) {
                                        if (err) {
                                            errorMessages.push({message: "Table de reference introuvable."});
                                            resolve(null, errorMessages);
                                        }
                                        console.log("TABLE REF FIND :");
                                        c = new Column({
                                            name: req.body.name,
                                            type: typeFind,
                                            isLabel: isLabel,
                                            relationType: req.body.relationType,
                                            tableReference: tableFind._id,
                                            nullable: n,
                                        });
                                        console.log(c);
                                        resolve(c, errorMessages);
                                    });
                                }
                                break;
                            case 'shorttext':
                                c = new Column({
                                    name: req.body.name,
                                    type: typeFind,
                                    isLabel: isLabel,
                                    min: (req.body.min == null) ? 0 : req.body.min,
                                    max: (req.body.max == null) ? 255 : req.body.max,
                                    defaultStringValue: (req.body.defaultStringValue == null) ? '' : req.body.defaultStringValue,
                                    nullable: n,
                                });
                                resolve(c, errorMessages);
                                break;
                            case 'longtext':
                                c = new Column({
                                    name: req.body.name,
                                    type: typeFind,
                                    isLabel: isLabel,
                                    min: (req.body.min == null) ? 0 : req.body.min,
                                    max: (req.body.max == null) ? 2500 : req.body.max,
                                    defaultStringValue: (req.body.defaultStringValue == null) ? '' : req.body.defaultStringValue,
                                    nullable: n,
                                });
                                resolve(c, errorMessages);
                                break;
                            case 'boolean':
                                c = new Column({
                                    name: req.body.name,
                                    type: typeFind,
                                    isLabel: isLabel,
                                    nullable: n,
                                });
                                resolve(c, errorMessages);
                                break;
                            case 'date':
                                c = new Column({
                                    name: req.body.name,
                                    type: typeFind,
                                    isLabel: isLabel,
                                    dateStart: req.body.dateStart,
                                    dateEnd: req.body.dateEnd,
                                    dateIsToday: (req.body.dateIsToday == null) ? false : req.body.dateIsToday,
                                    dateIsFree: (req.body.dateIsFree == null) ? false : req.body.dateIsFree,
                                    nullable: n,
                                });
                                resolve(c, errorMessages);
                                break;
                            default:
                                errorMessages.push({message: "Erreur type de la colonne."});
                                resolve(null, errorMessages);
                                break;
                        }
                    }
                });
            })
        }

        asyncTask(req, res, next).then(function(column, errorMessages) {
            if(errorMessages !== null && errorMessages !== undefined && errorMessages.length > 0) {
                return next({
                    status: 500,
                    message:errorMessages
                });
            }
            column.save(function (err, columnSaved) {
                if (err) {
                    console.log(err);
                    console.log(column);
                    return next({
                        status: 500,
                        message: "La colonne n'a pas pu etre ajouté"
                    });
                }
                req.data.table.columns.push(columnSaved);
                req.data.table.save(function (err, tableUpdated) {
                    if (err) {
                        return next({
                            message: "La colonne à été créée mais n'a pas pu être ajoutée à la table",
                        });
                    }
                    res.send(columnSaved);
                });
            });
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
            .findOne({_id: id})
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
                if (err || table === null || table === undefined) {
                    console.log('ERROR');
                    return next({
                        status: 404,
                        message: "La table n'a pas pu être récupérée."
                    });
                }
                console.log(table);
                req.data.table = table;
                next();
            });
    },

    lineIdParam: function (req, res, next, id) {
        Line
            .findOne({"_id": id})
            .populate({
                path: 'data',
                populate: {
                    path: 'column',
                    model: 'Column',
                    populate: {
                        path: 'type',
                        model: 'Type',
                    }
                }
            })
            .exec(function(err, line) {
                if (err || line === null || line === undefined) {
                    return next({
                        status: 500,
                        message: ["Ligne introuvable."]
                    });
                }
                req.data.line = line;
                next();
            });
    },

    columnIdParam: function (req, res, next, id) {
        Column.findOne({"_id": id}).exec(function(err, column) {
            if (err || column === null || column === undefined) {
                return next({
                    status: 404,
                    message: "La colonne n'a pas pu être récupérée."
                });
            }
            req.data.column = column;
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

    updateLine: function (req, res, next) {

        var asyncForeach = function asyncForeach(req, res) {
            return new Promise(function (resolve, reject) {
                var index = 0;
                if(req.body.datas.length === 0) resolve();
                req.body.datas.forEach(function(e) {
                    Data.findOne({_id:e._id}).exec(function (err, data) {
                        if(err || data === null) {
                            let data = new Data({
                                valueString: e.valueString,
                                valueNumber: e.valueNumber,
                                valueBoolean: e.valueBoolean,
                                valueObjectId: e.valueObjectId,
                                valueDate: e.valueDate,
                                value: e.value,
                                column: e.column,
                            });
                            data.save(function(err, dataSaved) {
                                if(err) {
                                    console.log("La donnée n'a pas pu etre créé : " + e.value);
                                    return next({
                                        message: "Impossible de créer la donnée"
                                    });
                                }
                                console.log("donnée créé : " + dataSaved.value);
                                req.data.line.data.push(dataSaved);
                                index++;
                                if (index >= req.body.datas.length) resolve();
                            });
                            console.log("CREATE DATA FOR " + e.value);
                        } else {
                            let update = {
                                valueString: e.valueString,
                                valueNumber: e.valueNumber,
                                valueObjectId: e.valueObjectId,
                                valueBoolean: e.valueBoolean,
                                valueDate: e.valueDate,
                                value: e.value,
                            };
                            let options = { new: true };
                            Data.findOneAndUpdate({ _id:data._id }, update, options, function(err, dataUpdated){
                                if(err) {
                                    console.log("Donnée non MAJ : " + e.value);
                                    return next({
                                        message: "Impossible de créer la donnée"
                                    });
                                }
                                console.log("Donnée MAJ: " + dataUpdated);
                                console.log("Donnée: " + e.value);
                                console.log("Donnée MAJ : " + dataUpdated);
                                index++;
                                if (index >= req.body.datas.length) resolve();
                            });
                        }
                    })
                })
            })
        };

        asyncForeach(req, res).then(function () {
            console.log("All data create / update");
            let update = { data: req.data.line.data };
            let options = { new: true };
            Line
                .findOneAndUpdate({ _id: req.data.line._id }, update, options)
                .populate({
                    path: 'data',
                    populate: {
                        path: 'column',
                        model: 'Column',
                        populate: {
                            path: 'type',
                            model: 'Type',
                        }
                    }
                })
                .exec( function(err, lineUpdated) {
                    if(err) {
                        console.log("ERREUR MAJ LINE");
                        return next({
                            message: "La ligne n'a pa pu être mise à jour"
                        });
                    }
                    console.log("MAJ ligne réussie");
                    res.send(lineUpdated);
                })
        });
    },

    updateColumn: function(req, res, next) {
        req.data.column.name = req.body.name;
        req.data.column.isLabel = req.body.isLabel;

        req.data.column.save(function (err) {
            if (err) {
                return next({
                    message: "Impossible de modifier la colonne"
                });
            }
            res.send(req.data.column);
        });
    },

    deleteBase: function (req, res, next) {
        var asyncForeach = function asyncForeach(req, res) {
            return new Promise(function (resolve, reject) {
                var index = 0;
                if(req.data.base.tables.length <= 0) resolve();
                req.data.base.tables.forEach(item => {
                    item.remove(function(err, itemRemoved) {
                        if (err) {
                            return next({
                                message: "La base n'a pas pu etre supprimé."
                            });
                        }
                        index++;
                        if(index >= req.data.base.tables.length) resolve();
                    });
                });
            });
        }

        asyncForeach(req, res).then(function() {
            req.data.base.remove(function(err, baseRemoved) {
                if (err) {
                    return next({
                        message: "La base n'a pas pu etre supprimé."
                    });
                }
                res.send({ success: 1 });
            });
        })
    },

    deleteTable: function (req, res, next) {
        var asyncForeach = function asyncForeach(req, res) {
            return new Promise(function (resolve, reject) {
                var columnsToDelete = [];
                Column.find({tableReference: req.data.table._id}, function (err, columns) {
                    if (err) {
                        return next({
                            message: "Erreur survenue."
                        });
                    }
                    if(columns === undefined || columns === null) columns = [];
                    columnsToDelete = columns;
                    var index = 0;
                    var dataToDelete = [];
                    if(index >= columnsToDelete.length) {
                        resolve({
                            columns: columnsToDelete,
                            data: dataToDelete,
                            lines : req.data.table.lines,
                            table: [req.data.table],
                        });
                    }
                    columnsToDelete.forEach(function (c) {
                        Data.find({column:c._id}).exec(function(err, dataFind) {
                            if (err) {
                                return next({
                                    message: "Erreur survenue."
                                });
                            }
                            if(dataFind === null || dataFind === undefined) dataFind = [];
                            index++;
                            dataToDelete = dataToDelete.concat(dataFind);
                            if(index >= columnsToDelete.length) {
                                resolve({
                                    columns: columnsToDelete,
                                    data: dataToDelete,
                                    lines : [],
                                    table: [req.data.table],
                                });
                            }
                        })
                    });
                });
            });
        };

        asyncForeach(req, res).then(function(toRemove) {
            toRemove.lines.forEach(function (l) {
                toRemove.data = toRemove.data.concat(l.data);
            });

            toRemove.columns = toRemove.columns.concat(req.data.table.columns)

            var dIndex = 0;
            var cIndex = 0;
            var lIndex = 0;
            var tIndex = 0;

            var asyncDelete = function asyncDelete(Model, array) {
                return new Promise(function (resolve, reject) {
                    let i = 0;
                    if(i >= array.length) resolve();
                    array.forEach(function(e) {
                        Model.deleteOne({_id:e._id}, function() {
                            i++;
                            if(i >= array.length) resolve();
                        });
                    });
                })
            };

            asyncDelete(Table, toRemove.table)
                .then(function() {
                    asyncDelete(Column, toRemove.columns)
                        .then(function() {
                            asyncDelete(Line, toRemove.lines)
                                .then(function() {
                                    asyncDelete(Data, toRemove.data)
                                        .then(function() {
                                            res.send({ok:true})
                                        })
                                })
                        })
                })
        })

    },

    deleteColumn: function (req, res, next) {
        var asyncForeach = function asyncForeach(req, res) {
            return new Promise(function (resolve, reject) {
                var linesUp
                Data.find({column:req.data.column._id}).exec(function(err, datas) {
                    if(err) {
                        return next({
                            message: "Les données associées n'ont pas été recupérées."
                        });
                    }
                    var index = 0;
                    if(datas.length <= 0) resolve();
                    datas.forEach(d => {
                        d.remove(function(err, dataRemoved) {
                            if (err) {
                                return next({
                                    message: "La base n'a pas pu etre supprimé."
                                });
                            }
                            index++;
                            if(index >= datas.length) resolve();
                        });
                    });
                });
            });
        }

        asyncForeach(req, res).then(function() {
            req.data.column.remove(function(err, dataRemoved) {
                if (err) {
                    return next({
                        message: "La colonne n'a pas pu etre supprimé."
                    });
                }
                Table
                    .findOne({_id:req.data.table._id})
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
                    .exec(function(err, tableFind) {
                        if(err || tableFind === null || tableFind === undefined) {
                            return next({
                                message: "Colonne supprimée mais table introuvable."
                            });
                        }
                        res.send(tableFind);
                    });
            });
        })

    },

    deleteLine: function(req, res, next) {
        console.log("Line find in lines");
        var asyncForeach = function asyncForeach(req, res) {
            return new Promise(function (resolve, reject) {
                let line = req.data.line;
                var index = 0;
                if (line.data.length === 0) resolve();

                console.log("Recherche de references.. ");
                Data
                    .find({})
                    .populate({
                        path: 'columns',
                        populate: {
                            path: 'type',
                            model: 'Type'
                        }
                    })
                    .exec(function(err, datas) {
                        var asyncDataEdit = function asyncForeach(req, res) {
                            return new Promise(function (resolve, reject) {
                                var index = 0;
                                datas.forEach(function (data) {
                                    if (data.valueObjectId !== null && data.valueObjectId !== undefined && data.valueObjectId.indexOf(req.data.line._id) > -1) {
                                        data.valueObjectId.splice(data.valueObjectId.indexOf(req.data.line._id), 1);
                                        data.save(function (err, dataSave) {
                                            if (err) {
                                                return next({
                                                    message: "Impossible de supprimer les references."
                                                });
                                            }
                                            index++;
                                            if (index >= datas.length) resolve();
                                        });
                                    } else index++;
                                    if (index >= datas.length) resolve();
                                });
                            });
                        };

                        asyncDataEdit(req, res).then(function () {
                            console.log('references supprimées');
                            var i = 0;
                            req.data.line.data.forEach(function(d) {
                                Data.deleteOne({_id: d._id}, function(err) {
                                    if(err) {
                                        console.log("Suppression impossible : " + d.value);
                                        return next({
                                            message: "Une donnée na pas pu être supprimée."
                                        });
                                    }
                                    console.log("Suppression réussie : " + d.value);
                                    i++;
                                    if (i >= line.data.length) resolve();
                                })
                            })
                        });
                    });
            })
        };

        asyncForeach(req, res).then(function () {
            console.log("All data supprimées, MAJ table");
            Table.updateOne({ lines: req.data.table.lines.pull(req.data.line._id) }, { _id: req.data.line._id }, function(err, tableUpdated) {
                if(err) {
                    console.log("ERREUR MAJ table");
                    return next({
                        message: "La table n'a pa pu être mise à jour"
                    });
                }
                console.log("MAJ table réussie");
                Line.deleteOne({_id: req.data.line._id}, function(err) {
                    if(err) {
                        console.log("ERREUR SUPPRESSION LIGNE");
                        return next({
                            message: "la ligne n'a pas pu être supprimée."
                        });
                    }
                    console.log("Ligne supprimée");
                    res.send(tableUpdated);
                })
            })
        });

        if(req.data.table.lines.includes(req.data.line)) {
            req.data.line.data.forEach(function(d) {
                Data.deleteOne({ _id:d._id }, function(err) {
                    if(err) {
                        return next({
                            message: "Une donnée na pas pu être supprimée."
                        });
                    }
                })
            });
        }
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
                                    if(!column.nullable && (e.value == null || e.value.length === 0)) {
                                        index++;
                                        errorMessages.push({column: column.name, message: "La donnée ne peut être vide."});
                                    } else {
                                        switch(column.type.realName) {
                                            case 'longtext':
                                            case 'shorttext':
                                                index++;
                                                if(e.value != null && column.min != null && e.value.length < column.min) errorMessages.push({column: column.name, message: "La donnée doit avoir au moins " + column.min + " caractères."});
                                                if(e.value != null && column.max != null && e.value.length > column.max) errorMessages.push({column: column.name, message: "La donnée doit avoir au plus " + column.max + " caractères."});
                                                break;
                                            case 'number':
                                                index++;
                                                if(!column.nullable && e.valueNumber == null) errorMessages.push({column: column.name, message: "La donnée envoyée n'est pas valide."});
                                                else {
                                                    if(e.valueNumber != null && column.min != null && e.valueNumber < column.min) errorMessages.push({column: column.name, message: "La donnée ne peut pas être inferieure à " + column.min + "."});
                                                    if(e.valueNumber != null && column.max != null && e.valueNumber > column.max) errorMessages.push({column: column.name, message: "La donnée ne peut pas être supérieure à " + column.max + "."});
                                                }
                                                break;
                                            case 'date':
                                                index++;
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
                                                index++;
                                                if (e.valueBoolean !== true && e.valueBoolean !== false && !column.nullable) errorMessages.push({column: column.name, message: "Type de donnée invalide."});
                                                break;
                                            case 'relation':
                                                if(column.relationType === 'one-to-one') {
                                                    console.log(e.valueObjectId);
                                                    console.log(!Array.isArray(e.valueObjectId));
                                                    if(!Array.isArray(e.valueObjectId) || e.valueObjectId.length > 1) {
                                                        console.log('A1');
                                                        errorMessages.push({column: column.name, message: "donnée incorrecte."});
                                                        index++;
                                                    } else {
                                                        console.log('A2');
                                                        Table.findOne({_id:column.tableReference}).exec(function(err, tableFind) {
                                                            index++;
                                                            if(err || tableFind === null || tableFind === undefined) errorMessages.push({column: column.name, message: "Table de reference introuvable."});
                                                            else {
                                                                if(e.valueObjectId.length > 0 && !tableFind.lines.includes(e.valueObjectId[0])) errorMessages.push({column: column.name, message: "donnée incorrecte."});
                                                            }
                                                            if(index >= req.body.datas.length) resolve(errorMessages);
                                                        });
                                                    }
                                                } else if(column.relationType === 'one-to-many') {
                                                    if(!Array.isArray(e.valueObjectId)) {
                                                        errorMessages.push({column: column.name, message: "donnée incorrecte."});
                                                        index++;
                                                    } else {
                                                        Table.findOne({_id:column.tableReference}).exec(function(err, tableFind) {
                                                            index++;
                                                            if(err || tableFind === null || tableFind === undefined) errorMessages.push({column: column.name, message: "Table de reference introuvable."});
                                                            else {
                                                                e.valueObjectId.forEach(function(lineId) {
                                                                    if(!tableFind.lines.includes(lineId)) errorMessages.push({column: column.name, message: "donnée incorrecte."});
                                                                })
                                                            }
                                                            if(index >= req.body.datas.length) resolve(errorMessages);
                                                        });
                                                    }
                                                } else {
                                                    errorMessages.push({column: column.name, message: "Le type de relation de la colonne est incorrect."});
                                                    index++;
                                                }
                                                break;
                                            default:
                                                index++;
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
            console.log(errorMessages);
            if(errorMessages.length > 0) {
                return next({
                    status: 500,
                    message:errorMessages
                });
            }
            console.log(req.body);
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
                            valueObjectId: e.valueObjectId,
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
                            console.log(dataSaved);
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

    getDataSelectors: function(req, res, next) {
        var columnsLabel = [];
        req.data.table.columns.forEach(function(c) {
            if(c.isLabel) columnsLabel.push(c._id);
        });
        var returnDataSelectors = [];
        req.data.table.lines.forEach(function(e) {
            if(columnsLabel.length > 0) {
                let labelTmp = '';
                e.data.forEach(function (d) {
                    columnsLabel.forEach(function (cl) {
                        if (cl.equals(d.column)) {
                            labelTmp += d.value + ' ';
                        }
                    });
                })
                let dataSelector = { label: labelTmp, id: e._id}
                returnDataSelectors.push(dataSelector);
            } else {
                let dataSelector = { label: e._id, id: e._id }
                returnDataSelectors.push(dataSelector);
            }
        });
        console.log(returnDataSelectors);
        res.send(returnDataSelectors);
    },

    getLabelRelation: function(req, res, next) {
        var asyncForeach = function asyncForeach(req, res, next) {
            return new Promise(function (resolve, reject) {
                var index = 0;
                var dataLabels = [];
                if(req.data.line.data.length < 1) resolve(dataLabels);
                req.data.line.data.forEach(function (d) {
                    Column
                        .findOne({_id: d.column})
                        .exec(function (err, column) {
                            if (err) {
                                console.log("Error")
                                return next({
                                    status: 500,
                                    message: "Colonne liée introuvable."
                                });
                            }
                            index++;
                            if (column.isLabel) dataLabels.push(d);
                            if (index >= req.data.line.data.length) resolve(dataLabels);
                        });
                });
            });
        }

        asyncForeach(req, res, next).then(function(dataLabels) {
            let label;
            if(dataLabels.length <= 0) label = req.data.line._id;
            else {
                label = '';
                dataLabels.forEach(function(d) {
                    label += d.value + ' ';
                });
            }
            return res.send({
                _id: req.data.line._id,
                label: label
            });
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
