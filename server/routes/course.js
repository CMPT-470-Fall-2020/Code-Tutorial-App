const router = require('express').Router();
const Course = require('./../models/courses.model');

// Add a new Course 
router.route("/courseList/add").post((req, res) => {
    let courseName = req.body.courseName;
    let courseCode = req.body.courseCode;
    let term = req.body.term;
  
    let newCourse = new Course({courseName, courseCode, term});
    newCourse.save()
      .then(() => res.json('Course added!'))
      .catch(err => res.status(400).json('Error: ' + err));
});
  
// Delete a Course 
router.route("/courseList/:classId").delete((req, res) => {
    let classId = req.params.classId;
  
    Course.findByIdAndDelete(classId)
      .then(() => res.json('Course deleted.'))
      .catch(err => res.status(400).json('Error: ' + err));
  
});

module.exports = router;