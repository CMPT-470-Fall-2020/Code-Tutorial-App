const router = require('express').Router();
const Post = require('./../models/posts.model');
const Comment = require('./../models/comments.model');

// Retrieve a list of all the posts for a certain class.
router.route("/:classId").get((req, res) => {
    let classId = req.params.classId;

    Post.find({'courseID': classId})
    .then(posts => res.json(posts))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Retrieve a list of all the posts for a certain class.
router.route("/:forumId/getPost").get((req, res) => {
    let forumId = req.params.forumId;

    Post.findById(forumId)
    .then(post => res.json(post))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Retrieve all the comments for a post in a specific class
router.route("/:classId/:postId").get((req, res) => {
    let postId = req.params.postId;

    Comment.find({'postID': postId})
    .then(comments => res.json(comments))
    .catch(err => res.status(400).json('Error: ' + err));
});

// get a single comment based on the id
router.route("/:classId/:postId/:commentId").get((req, res) => {
    let commentId = req.params.commentId;

    Comment.findById(commentId)
    .then(comment => res.json(comment))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new post for a particular subforum
router.route("/:classId/add").post((req, res) => {
    let courseID = req.params.classId;
    let userID = req.body.userID;
    let userName = req.body.userName;
    let postTitle = req.body.postTitle;
    let postText = req.body.postText;
    let newPost = new Post({userID, courseID, userName, postTitle, postText});

    newPost.save()
        .then(() => res.json('Post added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Update a post for a particular subform.
router.route("/:classId/:postId/update").post((req, res) => {
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
router.route("/:classId/:postId").delete((req, res) => {
    let postId = req.params.postId;

    Post.findByIdAndDelete(postId)
        .then(() => res.json('Post deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));

    Comment.deleteMany({"postID": postId})
        .catch(err => res.status(400).json('Error: ' + err));
});

// Create a comment in a post thread.
router.route("/:classId/:postId/add").post((req, res) => {
    console.log(req.body);
    let postID = req.body.postID;
    let userID = req.body.userID;
    let userName = req.body.userName;
    let commentText = req.body.commentText;
    
    let newComment = new Comment({postID, userID, userName, commentText});
    
    newComment.save()
        .then(() => res.json('Comment added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Update a comment for a specific post.
router.route("/:classId/:postId/:commentId/update").post((req, res) => {
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
router.route("/:classId/:postId/:commentId").delete((req, res) => {
    let commentId = req.params.commentId;

    Comment.findByIdAndDelete(commentId)
        .then(() => res.json('Comment deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;