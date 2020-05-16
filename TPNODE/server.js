const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const CORS = require('cors');

const app = express();
app.use(CORS());

require('./modules/posts/posts.model');
require('./modules/types/type.model');
require('./modules/bases/column.model');
require('./modules/bases/data.model');
require('./modules/bases/table.model');
require('./modules/bases/bases.model');
require('./modules/bases/line.model');
require('./modules/users/users.model');

const postRouter = require("./modules/posts/posts.router");
const baseRouter = require("./modules/bases/bases.router");
const typeRouter = require("./modules/types/types.router");
const userRouter = require("./modules/users/users.router");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/vue-js-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
    // we're connected!
    app.use(function (req, res, next) {
        req.data = {};
        next();
    });

    app.use("/posts", postRouter);
    app.use("/bases", baseRouter);
    app.use("/types", typeRouter);
    app.use("/users", userRouter);

    app.use(express.static(__dirname + '/public'));

    app.use(function (req, res, next) {
        next({
            status: 404,
            message: "Error 404 : Page not found !"
        });
    });

    app.use(function(err, req, res, next) {
        const message = (err.message || "Error");

        res.format({
            'text/plain': function () {
                res.send(message);
            },

            'text/html': function () {
                res.send('<p>'+message+'</p>');
            },

            'application/json': function () {
                res.send({ message: message });
            },

            'default': function () {
                // log the request and respond with 406
                res.status(406).send('Not Acceptable');
            }
        })
    });

    app.listen(3000 , function() {
        console.log("le serveur écoute sur le port 3000")
    });
});
