const router = require('express').Router();
const User = require('./../models/user.model');

// Add a new user
router.route("/add").post((req, res) => {
    let userName = req.body.userName;
    let password = req.body.password;
    let accountType = req.body.accountType;

    let newUser = new User({userName, password, accountType});
    newUser.save()
        .then(() => res.json('User added!'))
        .catch(err => res.status(400).json('Error: ' + err));
})

// Delete a User 
router.route("/delete").delete((req, res) => {
    let userID = req.body.userID;

    User.findByIdAndDelete(userID)
        .then(() => res.json('User deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Add a course to a user account
router.route("/addCourse").post((req, res) => {
    let userID = req.body.userID;
    let courseID = req.body.courseID;

    User.findByIdAndUpdate(userID, {$push: {courses: courseID}})
        .then(() => res.json('Course Added'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;