const mongoose = require('mongoose');
const Post = mongoose.model('Post');

module.exports = {
    getPosts: function (req, res, next) {
        Post.find().exec(function (err, posts) {
            if (err) {
                return next({
                    message: "Les posts n'ont pas pu etre envoyés."
                });
            }
            res.send(posts);
        });
    },

    postIdParam: function (req, res, next, id) {     // id = :userId = req.param.userId
        Post.find({"_id": id}).exec(function(err, posts) {
            if (err) {
                return next({
                    message: "Le post n'a pas pu etre récupéré."
                });
            }
            if (posts.length !== 1) {
                return next({
                    status: 404,
                    message: "Post introuvable"
                })
            }
            req.data.post = posts[0];
            next();
        });
    },

    getPost: function (req, res) {
        res.send({post: req.data.post});
    },

    updatePost: function (req, res, next) {
        if (req.body.title) req.data.post.title = req.body.title;
        if (req.body.body) req.data.post.body = req.body.body;
        req.data.post.save(function (err, postUpdate) {
            if (err) {
                return next({
                    message: "Impossible de maj le post"
                });
            }
            req.data.post = postUpdate;
            next();
        });
    },

    deletePost: function (req, res, next) {
        req.data.post.remove(function(err, postRemoved) {
            if (err) {
                return next({
                    message: "Le post n'a pas pu etre supprimé."
                });
            }
            res.send({success: 1});
        });
    },

    newPost: function (req, res, next) {
        console.log(req.body.title);
        console.log(req.body);
        const post = new Post({
            title: req.body.title,
            body: req.body.body
        });
        post.save(function(err, postSaved) {
            if (err) {
                return next({
                    message: "Le post n'a pas pu etre ajouté"
                });
            }
            res.send(postSaved);
        });
    }
};
