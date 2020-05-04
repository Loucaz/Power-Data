const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = {
    sendUsers: function (req, res, next) {
        User.find().exec(function (err, users) {
            if (err) {
                return next({
                    message: "Les utilisateurs n'ont pas pu être récupérés"
                });
            }
            res.send({
                users: users
            });
        });
    },

    userIdParam: function (req, res, next, id) { // id = :userId = req.param.userId
        User.find({"_id": id}).populate("binome").exec(function(err, users) {
            if (err) {
                return next({
                    message: "L'utilisateurs n'a pas pu être récupéré."
                });
            }
            if (users.length !== 1) {
                return next({
                    status: 404,
                    message: "Utilisateur introuvable"
                })
            }
            req.data.user = users[0];
            next();
        });
    },

    sendUser: function (req, res) {
        res.send({user: req.data.user});
    },

    updateUser: function (req, res, next) {
        if (req.body.name) req.data.user.name = req.body.name;
        if (req.body.binome) req.data.user.binome = req.body.binome;
        req.data.user.save(function (err, userUpdated) {
            if (err) {
                return next({
                    message: "L'utilisateur n'a pas pu être mis à jour."
                });
            }
            req.data.user = userUpdated;
            next();
        });
    },

    deleteUser: function (req, res, next) {
        req.data.user.remove(function(err, userRemoved) {
            if (err) {
                return next({
                    message: "L'utilisateur n'a pas pu être suppimé."
                });
            }
            res.send({success: 1});
        });
    },

    newUser: function (req, res, next) {
        const user = new User({
            name: req.body.name
        });
        user.save(function(err, userSaved) {
            if (err) {
                return next({
                    message: "L'utilisateur n'a pas pu être sauvegardé."
                });
            }
            res.send(userSaved);
        });
    }
};