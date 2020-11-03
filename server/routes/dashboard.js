const router = require('express').Router();
const User = require('./../models/user.model');
const Course = require('./../models/courses.model');

router.route('/').get((req, res) => {
    User.find({'courseID': req.body.userName, 'password': req.body.password})
      .then(user => res.json(user))
      .catch(err => res.status(400).json('Error: ' + err));
    res.redirect('/dashboard');
});

// Retrieve all the classes to be displayed on a certain users dashboard
router.route("/:userId").get((req, res) => { 
    User.findById(req.params.userId, function(err, user) { 
        if (err) {
            res.status(400).json('Error: ' + err);
            return;
        }

        Course.find({'courseCode': {$in: user.courses}})
        .then(courses => res.json(courses))
        .catch(err => res.status(400).json('Error: ' + err));
    });
  });

module.exports = router;