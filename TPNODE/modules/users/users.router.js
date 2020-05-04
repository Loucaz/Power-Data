var express = require('express');
const UM = require("./users.middlewares");
var router = express.Router();

router.param("userId", UM.userIdParam);

router.route("/")
    .get(UM.sendUsers)
    .post(UM.newUser);

router.route('/:userId')
    .get(UM.sendUser)
    .put(UM.updateUser, UM.sendUser)
    .delete(UM.deleteUser);

module.exports = router;