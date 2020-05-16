var express = require('express');
const UM = require("./users.middlewares");
var router = express.Router();


router.param("userId", UM.userIdParam);

router.route('/register')
    .post(UM.register);
router.route('/login')
    .post(UM.login);
router.route('/me')
    .get(UM.getUser);

router.route('/:userId')
    .get(UM.gUser)
    .put(UM.updateUser);

module.exports = router;