
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 4000;

// Database code
const User = require('./models/user.model');
const Comment = require('./models/comments.model');
const Course = require('./models/courses.model');
const Tutorial = require('./models/tutorial.model');

require('dotenv').config();
app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

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

// This is the default route. Not sure what to do with it yet.
app.get("/", (req, res) => {
  res.json({
    message: 'Hello World from the backend server on the "/" route!',
  });
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
