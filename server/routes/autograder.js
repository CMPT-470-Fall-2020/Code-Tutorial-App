const router = require('express').Router();
var multer = require('multer');
var fs = require('fs');
var path = require('path');
const Autograder = require('./../models/autograder.model');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, 'tests')
},
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-userID' + '-courseID-' + file.originalname)
  }
})
var upload = multer({ storage: storage }).single('file')

// Add a new Test 
router.route("/:classId/add").post((req, res) => {
    upload(req, res, function (err) {
      var courseID = req.params.classId;
      var userID = req.body.userID;
      var testName = req.body.testName;

      if (err instanceof multer.MulterError) {
          return res.status(500).json(err)
      } else if (err) {
          return res.status(500).json(err)
      }
      // rename file name to have user id
      fs.rename(req.file.path, req.file.path.replace('userID', userID).replace('courseID', courseID), () => {
        var fileName = req.file.path.replace('userID', userID).replace('courseID', courseID)
        var testName = req.file.originalname

        let newTest = new Autograder({userID, courseID, fileName, testName});
        newTest.save()
          .then(() => res.json('Test added!'))
          .catch(err => res.status(400).json('Error: ' + err));
      });
    })
});
  
// Delete a Test 
router.route("/:classId/:testId/tests/:fileName").delete((req, res) => {
    let testID = req.params.testId;
    let fileName = req.params.fileName;

    Autograder.findByIdAndDelete(testID)
    .then(() => res.json('Test deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
    let filepath = path.join(__dirname, '../tests/', fileName);
    fs.unlink(filepath, function (err) {
      if (err) throw err;
    });
});

// Get a Test 
router.route("/:classId/:testId").get((req, res) => {
    let testID = req.params.testID;

    Autograder.findById(testID)
      .then(test => res.json(test))
      .catch(err => res.status(400).json('Error: ' + err));
  
});

// Get all Tests for a class
router.route("/:classId").get((req, res) => {
  let classId = req.params.classId;

    Autograder.find({'courseID': classId})
      .then(tests => res.json(tests))
      .catch(err => res.status(400).json('Error: ' + err));
  
});

// Run test
router.route("/runTest").post((req,res) => {
  let test = req.body.test;
  let userCode = req.body.userCode;
  
  res.json("Test Passed");
});

module.exports = router;