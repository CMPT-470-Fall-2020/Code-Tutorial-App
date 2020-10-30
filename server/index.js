const path = require("path");
const express = require("express");
var app = express();
const port = process.env.PORT || 4000;

// THIS IS AN EXAMPLE OF HOW OUR FILES WILL BE SERVED WHEN WE UPLOAD TO GCP
// app.use(express.static(path.join(__dirname, "..","client", "build")));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, "..","client", "build", "index.html"))
// })

// TODO: need to route to ./routes
// TODO: Needs courses from database, add another argument for userid
app.get('/dashboard', (req, res) => {
  res.json([{id: 1, name: 'CMPT 470', description: 'Web-based Information Systems'}, 
  {id: 2, name: 'CMPT 383', description: 'Comparative Programming Languages'}])
})
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
