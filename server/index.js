const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const godBolt = require('./godbolt');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
// TODO: Apparently this is should not be run in prod since it leaks memory.
//       We need to replace it with something else.
//       Possible solution: https://stackoverflow.com/questions/44882535/warning-connect-session-memorystore-is-not-designed-for-a-production-environm
const cookieParser = require('cookie-parser');
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const events = require("events");
const interpManager = require("./manager.js");
const app = express();
const port = process.env.PORT || 4000;
const host = process.env.HOST || "127.0.0.1";

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// This runs the server in production(on our GCP VM)
app.use(express.static(path.join(__dirname, "..","client", "build")));

// This is our default route which serves the main index file containing
// all of our precious little code to our snotty customers.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "..","client", "build", "index.html"))
})

// You may be looking at this and wondering, why is this route the same as the above
// but commented out?
// Yavor says: I don't fucking know.
/*
app.get("/", (req, res) => {
  res.json({
    message: 'Hello World from the backend server on the "/" route!',
  });
});
*/

var ev = new events.EventEmitter();
var interpreterManager = new interpManager.InterpreterManager(ev);

app.post("/run", (req, res) => {
  console.log("SERVER: hit a POST /run route with request body", req.body);
  let uname = req.body.uname;
  let iname = req.body.iname;
  let code = req.body.code;
  let lang = req.body.lang;

  if (lang.trim().toLowerCase().startsWith("godbolt")) {
    godBolt.getBytecode(
      lang.trim().toLowerCase().split(":")[1],
      code,
      (response) => {
        res.json({ message: response });
      },
      (response) => {
        res.json({ message: response });
      }
    );
  } else {
    let currInstance = interpreterManager.getInstance(uname, iname, lang);
    // The language the user requested does not exist. Send out an error
    if (currInstance == interpManager.LANGDNE) {
      res.json({ message: "Language requested does not exist" });
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
const User = require("./models/user.model");
const Comment = require("./models/comments.model");
const Course = require("./models/courses.model");
const Tutorial = require("./models/tutorial.model");

require("dotenv").config();
app.use(
  cors({
    origin: "http://localhost:3000", //  Need to change origin for when it is hosted
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once("open", () => {
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
require("./passportConfig")(passport);

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
});

// Register a user with a new login and password
app.post("/register", (req, res) => {
  User.findOne({ userName: req.body.user.name }, async (err, doc) => {
    if (err) throw err;
    if (doc) {
      res.send("Username already exists. Please try another username");
    } else {
      const hashPass = await bcrypt.hash(req.body.user.password, 10);

      const newUser = new User({
        userName: req.body.user.name,
        password: hashPass,
        accountType: req.body.user.account,
      });
      await newUser.save();
      res.send("User Created");
    }
  });
});

// Terminate login session
app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});

// Return session data containing userID
app.get("/user", (req, res) => {
  //console.log("HIT /user route with request", req);
  res.send(req.user);
});
//-----------------------------------------------------------------------------------------
const dashboardRouter = require('./routes/dashboard');
const forumRouter = require('./routes/forum');
const tutorialRouter = require('./routes/tutorial');
const userRouter = require('./routes/user');
const courseRouter = require('./routes/course');

app.use('/dashboard', dashboardRouter);
app.use('/forum', forumRouter);
app.use('/tutorial', tutorialRouter);
app.use('/user', userRouter);
app.use('/course', courseRouter);


// TODO: Work on login authentication


app.listen(port, host, () => {
  console.log(`Backend server listening on port ${port} at host ${host}`);
});
