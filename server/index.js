const path = require("path");
const express = require("express");
var app = express();
const port = process.env.PORT || 4000;

// THIS IS AN EXAMPLE OF HOW OUR FILES WILL BE SERVED WHEN WE UPLOAD TO GCP
// app.use(express.static(path.join(__dirname, "..","client", "build")));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, "..","client", "build", "index.html"))
// })

// Retrieve a list of all the threads for a class forum.
app.get("/forum/:subforumId", (req, res) => {});

// Retrieve all the posts for a particular thread in a particular class forum
app.get("/forum/:subforumId/:threadId", (req, res) => {});
// Add a new post for a particular subforum
app.post("/forum/:subforumId/:threadId", (req, res) => {});
// Delete a particular thread in a class forum
app.delete("/forum/:subforumId/:threadId", (req, res) => {});

// Update a particular post in a class forum thread
app.post("/forum/:subforumId/:threadId/:postId", (req, res) => {});
// Delete a particular post in a class forum thread
app.delete("/forum/:subforumId/:threadId/:postId", (req, res) => {});

// Routing for tutorial list
// Retrieve a list of tutorials for a particular class
app.get("/tutorial/:classId/:tutorialSet", (req, res) => {});
// Add a new tutorial to the list of tutorials for a particular class
app.post("/tutorial/:classId/:tutorialSet", (req, res) => {});

// Routing for individual tutorials
// Retrieve the text of a tutorial
app.get("/tutorial/:classId/:tutorialSet/:tutorialId", (req, res) => {});
// Add/Change or hide/show tutorial to students
app.post("/tutorial/:classId/:tutorialSet/:tutorialId", (req, res) => {});
// Remove tutorial
app.delete("/tutorial/:classId/:tutorialSet/:tutorialId", (req, res) => {});

/* Temp routing code */
// const dashboardRouter = require('./routes/dashboard');
app.get("/dashboard", (req, res) => {
  res.json([
    { id: 1, name: "CMPT 470" },
    { id: 2, name: "CMPT 471" },
  ]);
});

app.get("/", (req, res) => {
  res.json({
    message: 'Hello World from the backend server on the "/" route!',
  });
});

app.get("/coursesPage", (req, res) => {
  res.json([
    { id: 1, title: "Assignment 1 clarification" },
    { id: 2, title: "Exam coverage" },
  ]);
});

app.get("/coursesPage/tutorials", (req, res) => {
  res.json([
    { id: 1, title: "Tutorial 1" },
    { id: 2, title: "Tutorial 2" },
  ]);
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
