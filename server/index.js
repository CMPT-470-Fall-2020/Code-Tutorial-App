const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const mongoose = require('mongoose');
const godBolt = require('./godbolt');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
//const User = require('./models/user.model');
const events = require("events");
const interpManager = require("./manager.js");

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const port = process.env.PORT || 4000;

var ev = new events.EventEmitter();
var interpreterManager = new interpManager.InterpreterManager(ev);

app.post("/run", (req, res) => {
  console.log("SERVER: hit a POST /run route with request body", req.body);
  let uname = req.body.uname;
  let iname = req.body.iname;
  let code = req.body.code;
  let lang = req.body.lang;

  if (lang.trim().toLowerCase().startsWith("godbolt")) {
    godBolt.getBytecode(lang.trim().toLowerCase().split(":")[1],
      code,
      (response) => { res.json({ message: response }) },
      (response) => { res.json({ message: response }) })
  } else {
    let currInstance = interpreterManager.createInterp(uname, iname, lang);
    // The language the user requested does not exist. Send out an error
    if (currInstance == interpManager.LANGDNE) {
      res.json({ message: "Language requested does not exist" })
    } else {
      let hash = currInstance.runCode(code);
      ev.on(hash, (codeResp) => {
        console.log(
          "SERVER: sending response from language servers back to client:",
          codeResp
        );
        res.json({ message: codeResp });
      });
    }
  }
});

// Database code
const User = require('./models/user.model');
const Autograder = require('./models/autograder.model');
const Comment = require('./models/comments.model');
const Post = require('./models/posts.model');
const Course = require('./models/courses.model');
const Tutorial = require('./models/tutorial.model');

require('dotenv').config();
app.use(cors({
  origin: "http://localhost:3000", //  Need to change origin for when it is hosted
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// Authentication
//-----------------------------------------------------------------------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

// Authenticate and login user 
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Authentication: Success");
        console.log(req.user);
      });
    }
  })(req, res, next);
})

// Register a user with a new login and password
app.post("/register", (req, res) => {
  User.findOne({ userID: req.body.user.name }, async (err, doc) => {
    if (err) throw err;
    if (doc) {
      res.send("Username already exists. Please try another username")
    }
    else {
      const hashPass = await bcrypt.hash(req.body.user.password, 10);

      const newUser = new User({
        userID: req.body.user.name,
        password: hashPass
      });
      await newUser.save();
      res.send("User Created");
    }
  })
})

// Terminate login session
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// Return session data containing userID
app.get("/user", (req, res) => {
  res.send(req.user.userID);
})
//-----------------------------------------------------------------------------------------


// THIS IS AN EXAMPLE OF HOW OUR FILES WILL BE SERVED WHEN WE UPLOAD TO GCP
// app.use(express.static(path.join(__dirname, "..","client", "build")));


// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, "..","client", "build", "index.html"))
// })

// Add a new user
app.post("/user/add", (req, res) => {
  let userName = req.body.userName;
  let password = req.body.password;
  let accountType = req.body.accountType;

  let newUser = new User({ userName, password, accountType });
  newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));

})

// Delete a User 
app.delete("/user/delete", (req, res) => {
  let userID = req.body.userID;

  User.findByIdAndDelete(userID)
    .then(() => res.json('User deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));

});

// Add a new Course 
app.post("/courseList/add", (req, res) => {
  let courseName = req.body.courseName;
  let courseCode = req.body.courseCode;
  let term = req.body.term;

  let newCourse = new Course({ courseName, courseCode, term });
  newCourse.save()
    .then(() => res.json('Course added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Delete a Course 
app.delete("/courseList/:classId", (req, res) => {
  let classId = req.params.classId;

  Course.findByIdAndDelete(classId)
    .then(() => res.json('Course deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));

});

// Retrieve a list of all the posts for a certain class.
app.get("/forum/:classId", (req, res) => {
  let classId = req.params.classId;

  Post.find({ 'courseID': classId })
    .then(posts => res.json(posts))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Retrieve all the comments for a post in a specific class
app.get("/forum/:classId/:postId", (req, res) => {
  let postId = req.params.postId;

  Comment.find({ 'postID': postId })
    .then(comments => res.json(comments))
    .catch(err => res.status(400).json('Error: ' + err));
});

// get a single comment based on the id
app.get("/forum/:classId/:postId/:commentId", (req, res) => {
  let commentId = req.params.commentId;

  Comment.findById(commentId)
    .then(comment => res.json(comment))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new post for a particular subforum
app.post("/forum/:classId/add", (req, res) => {
  let courseID = req.params.classId;
  let userID = req.body.userId;
  let postTitle = req.body.postTitle;
  let postText = req.body.postText;
  console.log(courseID);
  let newPost = new Post({ userID, courseID, postTitle, postText });
  console.log(newPost);
  newPost.save()
    .then(() => res.json('Post added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update a post for a particular subform.
app.post("/forum/:classId/:postId/update", (req, res) => {
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
app.delete("/forum/:classId/:postId", (req, res) => {
  let postId = req.params.postId;

  Post.findByIdAndDelete(postId)
    .then(() => res.json('Post deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));

  Comment.deleteMany({ "postID": postId })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Create a comment in a post thread.
app.post("/forum/:classId/:postId/add", (req, res) => {
  let postID = req.params.postId;
  let userID = req.body.userId;
  let commentText = req.body.commentText;

  let newComment = new Comment({ postID, userID, commentText });
  newComment.save()
    .then(() => res.json('Comment added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update a comment for a specific post.
app.post("/forum/:classId/:postId/:commentId/update", (req, res) => {
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
app.delete("/forum/:classId/:postId/:commentId", (req, res) => {
  let commentId = req.params.commentId;

  Comment.findByIdAndDelete(commentId)
    .then(() => res.json('Comment deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Routing for general list of tutorials
// Retrieve a list of tutorials for a particular class
app.get("/tutorial/:classId", (req, res) => {
  let classId = req.params.classId;

  Tutorial.find({ 'courseID': classId })
    .then(tutorials => res.json(tutorials))
    .catch(err => res.status(400).json('Error: ' + err));

});


// Add a new tutorial to the tutorials for a particular class
app.post("/tutorial/:classId/add", (req, res) => {
  let courseID = req.params.classId;
  let tutorialName = req.body.tutorialName;
  let userID = req.body.userID;
  let codeText = req.body.codeText;

  let newTutorial = new Tutorial({ tutorialName, userID, courseID, codeText });
  newTutorial.save()
    .then(() => res.json('Tutorial added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Routing for individual tutorials
// Retrieve a tutorial
app.get("/tutorial/:classId/:tutorialId", (req, res) => {
  let tutId = req.params.tutorialId;

  Tutorial.findById(tutId)
    .then(tutorial => res.json(tutorial))
    .catch(err => res.status(400).json('Error: ' + err));

});

// Add/Change or hide/show tutorial to students
app.post("/tutorial/:classId/:tutorialId/update", (req, res) => {
  let tutId = req.params.tutorialId;

  Tutorial.findById(tutId)
    .then(tutorial => {
      tutorial.tutorialName = req.body.tutorialName;
      tutorial.userID = req.body.userID;
      tutorial.courseID = req.params.classId;
      tutorial.codeText = req.body.codeText;

      tutorial.save()
        .then(() => res.json('Exercise updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Remove tutorial
app.delete("/tutorial/:classId/:tutorialId", (req, res) => {
  let tutId = req.params.tutorialId;

  Tutorial.findByIdAndDelete(tutId)
    .then(() => res.json('Tutorial deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));

});


/* Temp routing code */
// const dashboardRouter = require('./routes/dashboard');

// Retrieve all the classes to be displayed on a certain users dashboard
app.get("/dashboard/:userId", (req, res) => {
  let userId = req.params.userId;
});

app.post("/run", (req, res) => {
  let lang = req.body.lang
  let code = req.body.code
  // TODO: Add more error handling for different badly formatted inputs
  if (lang.trim().toLowerCase().startsWith("godbolt")) {
    godBolt.getBytecode(lang.trim().toLowerCase().split(":")[1],
      code,
      (response) => { res.json({ message: response }) },
      (response) => { res.json({ message: response }) })
  } else {
    // TODO: Hook up code evaluation classes here.
  }
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
