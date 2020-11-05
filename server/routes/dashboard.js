const router = require('express').Router();
const User = require('./../models/user.model');
const Course = require('./../models/courses.model');

// Retrieve all the classes to be displayed on a certain users dashboard
router.route("/:userId").get((req, res) => { 
    User.findById(req.params.userId, function(err, user) { 
        if (err) {
            res.status(400).json('Error: ' + err);
            return;
        }

        Course.findById({$in: user.courses})
        .then(courses => res.json(courses))
        .catch(err => res.status(400).json('Error: ' + err));
    });
  });

module.exports = router;