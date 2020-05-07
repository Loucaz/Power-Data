var express = require('express');
const UM = require("./users.middlewares");
var router = express.Router();


router.route('/register')
    .post(UM.register);
router.route('/login')
    .post(UM.login);
module.exports = router;