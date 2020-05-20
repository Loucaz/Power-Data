const mongoose = require('mongoose');
const User = mongoose.model('User');
const Base = mongoose.model('Base');

var bcrypt = require('bcrypt');
var jwtUtils = require('../../outils/jwt.outils');
var asyncLib = require('async');


// Constants
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,20}$/;

module.exports = {
    register: function (req, res) {
        // Params
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;

        if (email == null || username == null || password == null) {
            return res.status(400).json({'error': 'Paramètres manquants'});
        }

        if (username.length >= 21 || username.length <= 3) {
            return res.status(400).json({'error': 'Login non valide (entre 4 et 20 caractères)'});
        }

        if (!EMAIL_REGEX.test(email.toLowerCase())) {
            return res.status(400).json({'error': 'Email non valide'});
        }

        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({'error': 'Mot de passe non valide (doit contenir 1 chiffre et entre 4 et 20 caractères)'});
        }

        asyncLib.waterfall([
            function (done) {
                User.findOne({email: email})
                    .then(function (userFound) {
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        return res.status(500).json({'error': 'Erreur de vérification'});
                    });
            },
            function (userFound, done) {
                if (!userFound) {
                    bcrypt.hash(password, 5, function (err, bcryptedPassword) {
                        done(null, userFound, bcryptedPassword);
                    });
                } else {
                    return res.status(409).json({'error': 'Email déjà utilisée'});
                }
            },
            function (userFound, bcryptedPassword, done) {
                var newUser = User.create({
                    email: email,
                    username: username,
                    password: bcryptedPassword
                })
                    .then(function (newUser) {
                        done(newUser);
                    })
                    .catch(function (err) {
                        return res.status(500).json({'error': 'Erreur de création de compte'});
                    });
            }
        ], function (newUser) {
            if (newUser) {
                return res.status(201).json({
                    'userId': newUser.id
                });
            } else {
                return res.status(500).json({'error': 'Erreur de création de compte'});
            }
        });
    },
    login: function (req, res) {

        // Params
        var email = req.body.email;
        var password = req.body.password;

        if (email == null || password == null) {
            return res.status(400).json({'error': 'Paramètres manquants'});
        }

        asyncLib.waterfall([
            function (done) {
                User.findOne({email: email})
                    .then(function (userFound) {
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        return res.status(500).json({'error': 'Erreur de vérification'});
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
                        done(null, userFound, resBycrypt);
                    });
                } else {
                    return res.status(404).json({'error': 'Compte inexistant '});
                }
            },
            function (userFound, resBycrypt, done) {
                if (resBycrypt) {
                    done(userFound);
                } else {
                    return res.status(403).json({'error': 'Mot de passe incorrecte '});
                }
            }
        ], function (userFound) {
            if (userFound) {
                return res.status(201).json({
                    'userId': userFound.id,
                    'token': jwtUtils.generateTokenForUser(userFound),
                    'username': userFound.username,
                });
            } else {
                return res.status(500).json({'error': 'Erreur de connexion'});
            }
        });
    },

    getUser: function (req, res) {
        // Getting auth header

        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        if (userId < 0)
            return res.status(400).json({'error': 'Session expirée'});

        User.findOne({_id: userId}
        ).then(function (user) {
            if (user) {
                res.status(201).json(user);
            } else {
                res.status(404).json({'error': 'Erreur de connexion'});
            }
        }).catch(function (err) {
            res.status(500).json({'error': 'Erreur de connexion'});
        });
    },

    userIdParam: function (req, res, next, id) {     // id = :userId = req.param.userId
        User.find({"_id": id}).populate('bases').exec(function (err, users) {
            if (err) {
                return next({
                    message: "Erreur de connexion"
                });
            }
            if (users.length !== 1) {
                return next({
                    status: 404,
                    message: "Erreur de connexion"
                })
            }
            req.data.user = users[0];
            next();
        });
    },

    gUser: function (req,res){
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        if (userId < 0)
            return res.status(400).json({'error': 'Session expirée'});

        res.send({user: req.data.user});
    },

    updateUser: function (req, res) {
        req.data.user.bases.push(req.body.nbase);
        req.data.user.save(function (err, userUpdate) {
            if (err) {
                return next({
                    message: "Impossible d'update le user"
                });
            }
            req.data.user = userUpdate;
            res.send(userUpdate);
        });

    },
};