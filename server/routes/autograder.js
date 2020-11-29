const router = require('express').Router();
const Autograder = require('./../models/autograder.model');

// Add a new Test 
router.route("/:classId/add").post((req, res) => {
    let courseID = req.params.classId;
    let userID = req.body.userID;
    let code = req.body.code;
    let testName = req.body.testName;
  
    let newTest = new Autograder({userID, courseID, code, testName});
    newCourse.save()
      .then(() => res.json('Test added!'))
      .catch(err => res.status(400).json('Error: ' + err));
});
  
// Delete a Test 
router.route("/").delete((req, res) => {
    let testID = req.body.testID;
  
    Autograder.findByIdAndDelete(testID)
      .then(() => res.json('Test deleted.'))
      .catch(err => res.status(400).json('Error: ' + err));
  
});

// Get a Test 
router.route("/").get((req, res) => {
    let testID = req.body.testID;
  
    Autograder.findById(testID)
      .then(test => res.json(test))
      .catch(err => res.status(400).json('Error: ' + err));
  
});

module.exports = router;