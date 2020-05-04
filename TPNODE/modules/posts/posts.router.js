var express = require('express');
const PM = require("./posts.middleware");
var router = express.Router();

router.param("postId", PM.postIdParam);

router.route("/")
    .get(PM.getPosts)
    .post(PM.newPost);

router.route('/:postId')
    .get(PM.getPost)
    .put(PM.updatePost, PM.getPost)
    .delete(PM.deletePost);

module.exports = router;
