const router = require('express').Router();

router.route('/').get((req, res) => {
    // console.log(req.body);

    res.json({message: 'dashboard page'});
    res.redirect('/dashboard');
});

router.route('/user').get((req, res) => {
    // console.log(req.body);

    res.json({message: 'User course page'});
});


module.exports = router;