
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
var app = express();
const port = process.env.PORT || 4000;

// Database code
require('dotenv').config();
app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// THIS IS AN EXAMPLE OF HOW OUR FILES WILL BE SERVED WHEN WE UPLOAD TO GCP
// app.use(express.static(path.join(__dirname, "..","client", "build")));


// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, "..","client", "build", "index.html"))
// })

// Retrieve a list of all the posts for a certain class.
app.get("/forum/:classId", (req, res) => {
  let classId = req.params.classId;
});

// Retrieve all the comments for a post in a specific class
app.get("/forum/:classId/:postId", (req, res) => {
  let classId = req.params.classId;
  let postId = req.params.postId;
  console.log("classId", classId, "postId", postId);
});

// Add a new post for a particular subforum
app.post("/forum/:classId/:postId", (req, res) => {
  let classId = req.params.classId;
  let postId = req.params.postId;
});
// Delete a particular thread in a class forum
app.delete("/forum/:classId/:postId", (req, res) => {
  let classId = req.params.classId;
  let postId = req.params.postId;
  // Delete the post with id postId in the  class with classId.
});

// Update/Create a comment in a post thread.
app.post("/forum/:classId/:postId/:commentId", (req, res) => {
  let classId = req.params.classId;
  let postId = req.params.postId;
  let commentId = req.params.commentId;
  // Change the text of a comment for a specific post.
});

// Delete a particular post in a class forum thread
app.delete("/forum/:classId/:postId/:commentId", (req, res) => {
  let classId = req.params.classId;
  let postId = req.params.postId;
  let commentId = req.params.commentId;
  // Delete a particular comment in the class forum.
});

// Routing for general list of tutorials
// Retrieve a list of tutorials for a particular class
app.get("/tutorial/:classId/", (req, res) => {
  let classId = req.params.classId;
});

// Add a new tutorial to the tutorials for a particular class
app.post("/tutorial/:classId/", (req, res) => {
  let classId = req.params.classId;
});

// Routing for individual tutorials
// Retrieve the text of a tutorial
app.get("/tutorial/:classId/:tutorialId", (req, res) => {
  let classId = req.params.classId;
  let tutId = req.params.tutorialId;
});
// Add/Change or hide/show tutorial to students
app.post("/tutorial/:classId/:tutorialId", (req, res) => {
  let classId = req.params.classId;
  let tutId = req.params.tutorialId;
});
// Remove tutorial
app.delete("/tutorial/:classId/:tutorialId", (req, res) => {
  let classId = req.params.classId;
  let tutId = req.params.tutorialId;
});

/* Temp routing code */
// const dashboardRouter = require('./routes/dashboard');

// Retrieve all the classes to be displayed on a certain users dashboard
app.get("/dashboard/:userId", (req, res) => {
  let userId = req.params.userId;
});

// TODO: Work on login authentication

// This is the default route. Not sure what to do with it yet.
app.get("/", (req, res) => {
  res.json({
    message: 'Hello World from the backend server on the "/" route!',
  });
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
