const router = require('express').Router();
const Tutorial = require('./../models/tutorial.model');

// Routing for general list of tutorials
// Retrieve a list of tutorials for a particular class
router.route("/:classId").get((req, res) => {
    let classId = req.params.classId;
    
    Tutorial.find({'courseID': classId})
      .then(tutorials => res.json(tutorials))
      .catch(err => res.status(400).json('Error: ' + err));
});
  
// Add a new tutorial to the tutorials for a particular class
router.route("/:classId/add").post((req, res) => {
    let courseID = req.params.classId;
    let tutorialName = req.body.tutorialName;
    let userID = req.body.userID;
    let codeText = req.body.codeText;
    let htmlText = req.body.htmlText;


    let newTutorial = new Tutorial({tutorialName, userID, courseID, codeText, htmlText});
    newTutorial.save()
        .then(() => res.json('Tutorial added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Routing for individual tutorials
// Retrieve a tutorial
router.route("/:classId/:tutorialId").get((req, res) => {
    let tutId = req.params.tutorialId;

    Tutorial.findById(tutId)
        .then(tutorial => res.json(tutorial))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Add/Change or hide/show tutorial to students
router.route("/:classId/:tutorialId/update").post((req, res) => {
    let tutId = req.params.tutorialId;

    Tutorial.findById(tutId)
        .then(tutorial => {
        tutorial.tutorialName = req.body.tutorialName;
        tutorial.userID = req.body.userID;
        tutorial.courseID = req.params.classId;
        tutorial.codeText = req.body.codeText,
        tutorial.htmlText = req.body.htmlText;


        tutorial.save()
            .then(() => res.json('Exercise updated!'))
            .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// Remove tutorial
router.route("/:classId/:tutorialId").delete((req, res) => {
    let tutId = req.params.tutorialId;

    Tutorial.findByIdAndDelete(tutId)
        .then(() => res.json('Tutorial deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;