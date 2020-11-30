const router = require('express').Router();
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
const Autograder = require('./../models/autograder.model');

// Add a new Test 
router.route("/:classId/add").post((req, res) => {
    let courseID = req.params.classId;
    let userID = req.body.userID;
    let testName = req.body.testName;

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path; 
      var newpath = '../../../files/' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
      });
    });

    let fileName =  Date.now() + userID + "-" + courseID + "-test." + path.extname(oldpath);
  
    let newTest = new Autograder({userID, courseID, fileName, testName});
    newTest.save()
      .then(() => res.json('Test added!'))
      .catch(err => res.status(400).json('Error: ' + err));
});
  
// Delete a Test 
router.route("/").delete((req, res) => {
    let testID = req.body.testID;
  
    Autograder.findById(testID)
      .then(test)
      .catch(err => res.status(400).json('Error: ' + err));

    fs.unlink('../../../files/' + test.fileName, function (err) {
      if (err) throw err;
      res.json('Test deleted!');
    });
  
});

// Get a Test 
router.route("/").get((req, res) => {
    let testID = req.body.testID;
  
    Autograder.findById(testID)
      .then(test => res.json(test))
      .catch(err => res.status(400).json('Error: ' + err));
  
});

module.exports = router;