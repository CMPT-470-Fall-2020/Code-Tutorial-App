const router = require("express").Router();
var multer = require("multer");
var fs = require("fs");
var path = require("path");
const { AutoGraderInstance } = require("../autograder-docker");
const Autograder = require("./../models/autograder.model");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  	// According to the docs, if we are using a function as the destination,
  	// we have to create the folder ourselves. If the folder does not exist,
  	// it is created. This is done synchronously.
	let testDir = path.join(__dirname, '../tests');
	if (!fs.existsSync(testDir)){
   	 fs.mkdirSync(testDir);
	}

    cb(null, "tests");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-userID" + "-courseID-" + file.originalname);
  },
});
var upload = multer({ storage: storage }).single("file");

// Add a new Test
router.route("/:classId/add").post((req, res) => {
  upload(req, res, function (err) {
    var courseID = req.params.classId;
    var userID = req.body.userID;
//    var testName = req.body.testName;
    var language = req.body.language;

    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    // rename file name to have user id
    fs.rename(
      req.file.path,
      req.file.path.replace("userID", userID).replace("courseID", courseID),
      () => {
        var fileName = req.file.path
          .replace("userID", userID)
          .replace("courseID", courseID);
        var testName = req.file.originalname;

        let newTest = new Autograder({ userID, courseID, language, fileName, testName });
        newTest
          .save()
          .then(() => res.json("Test added!"))
          .catch((err) => res.status(400).json("Error: " + err));
      }
    );
  });
});

// Delete a Test
router.route("/:classId/:testId/tests/:fileName").delete((req, res) => {
  let testID = req.params.testId;
  let fileName = req.params.fileName;

  Autograder.findByIdAndDelete(testID)
    .then(() => res.json("Test deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
  let filepath = path.join(__dirname, "../tests/", fileName);
  fs.unlink(filepath, function (err) {
    if (err) throw err;
  });
});

// Get a Test
router.route("/:classId/:testId").get((req, res) => {
  let testID = req.params.testID;

  Autograder.findById(testID)
    .then((test) => res.json(test))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Get all Tests for a class
router.route("/:classId").get((req, res) => {
  let classId = req.params.classId;

  Autograder.find({ courseID: classId })
    .then((tests) => res.json(tests))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Run test
router.route("/runTest").post((req, res) => {
  let testObject = req.body.test;
  let testBaseFile = testObject.fileName;
  let userCode = req.body.code;
  console.log("Output of the params", testBaseFile, userCode);

  let autograderInstance = new AutoGraderInstance("bullshit");
  autograderInstance.startInstance(() => {
    console.log("Instance Started!");
    autograderInstance.sendArchiveToInstance(
      testBaseFile,
      "professorTest.py",
      userCode,
      (output) => {
        res.json(output);
      }
    );
  });
});

module.exports = router;
