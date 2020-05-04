var express = require('express');
const TM = require("./types.middleware");
var router = express.Router();

router.route("/")
    .get(TM.getTypes)
    .post(TM.addType);

module.exports = router;
