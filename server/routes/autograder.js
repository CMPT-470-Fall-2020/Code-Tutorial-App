const router = require('express').Router();
var formidable = require('formidable');
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
        var fileName = userID + '-' + courseID + '-' + req.file.originalname
        var testName = req.file.originalname

        let newTest = new Autograder({userID, courseID, fileName, testName});
        newTest.save()
          .then(() => res.json('Test added!'))
          .catch(err => res.status(400).json('Error: ' + err));
      });
    })
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