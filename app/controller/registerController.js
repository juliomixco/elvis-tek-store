const express = require('express');
const User = require('../model').user;
var router = express.Router();


// Register new users
router.post('/register', function (req, res) {
    if (!req.body.name || !req.body.password) {
        res.json({ success: false, message: 'Please enter email and password.' });
    } else {
        User.findByName(req.body.name)
            .then(user => {
                if (user) {
                    throw 'User already exists';
                } else {
                    return User.create(req.body.name, req.body.password);                        
                }
            }).then((user) => {
                res.status(200);
                res.set({ 'Content-Type': 'application/json' });
                res.json({ success: true, message: 'Successfully created new user.' });
            })
            .catch(error => {
                res.status(400);
                res.json({ success: false, message: error });
            });


    }
});
module.exports = router;