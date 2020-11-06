const router = require('express').Router();
const Post = require('./../models/posts.model');

// remove after changing app.get to router
const express = require('express');
const app = express(); 

//TODO: change app.get to router.route()

// Retrieve a list of all the posts for a certain class.
app.get("/:classId", (req, res) => {
let classId = req.params.classId;

Post.find({'courseID': classId})
.then(posts => res.json(posts))
.catch(err => res.status(400).json('Error: ' + err));
});

// Retrieve all the comments for a post in a specific class
app.get("/:classId/:postId", (req, res) => {
let postId = req.params.postId;

Comment.find({'postID': postId})
.then(comments => res.json(comments))
.catch(err => res.status(400).json('Error: ' + err));
});

// get a single comment based on the id
app.get("/:classId/:postId/:commentId", (req, res) => {
let commentId = req.params.commentId;

Comment.findById(commentId)
.then(comment => res.json(comment))
.catch(err => res.status(400).json('Error: ' + err));
});

// Add a new post for a particular subforum
app.post("/:classId/add", (req, res) => {
let courseID = req.params.classId;
let userID = req.body.userId;
let postTitle = req.body.postTitle;
let postText = req.body.postText;
console.log(courseID);
let newPost = new Post({userID, courseID, postTitle, postText});
console.log(newPost);
newPost.save()
    .then(() => res.json('Post added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update a post for a particular subform.
app.post("/:classId/:postId/update", (req, res) => {
let postId = req.params.postId;

Post.findById(postId)
    .then(post => {
    post.userID = req.body.userID;
    post.courseID = req.params.classId;
    post.postTitle = req.body.postTitle;
    post.postText = req.body.postText;

    post.save()
        .then(() => res.json('Post updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Delete a particular thread in a class forum
app.delete("/:classId/:postId", (req, res) => {
let postId = req.params.postId;

Post.findByIdAndDelete(postId)
    .then(() => res.json('Post deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));

Comment.deleteMany({"postID": postId})
    .catch(err => res.status(400).json('Error: ' + err));
});

// Create a comment in a post thread.
app.post("/:classId/:postId/add", (req, res) => {
let postID = req.params.postId;
let userID = req.body.userId;
let commentText = req.body.commentText;

let newComment = new Comment({postID, userID, commentText});
newComment.save()
    .then(() => res.json('Comment added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update a comment for a specific post.
app.post("/:classId/:postId/:commentId/update", (req, res) => {
let commentId = req.params.commentId;

Comment.findById(commentId)
    .then(comment => {
    comment.postId = req.params.postId;
    comment.userID = req.body.userID;
    comment.commentText = req.body.commentText;

    comment.save()
        .then(() => res.json('Comment updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Delete a particular comment in a class forum thread
app.delete("/:classId/:postId/:commentId", (req, res) => {
let commentId = req.params.commentId;

Comment.findByIdAndDelete(commentId)
    .then(() => res.json('Comment deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;