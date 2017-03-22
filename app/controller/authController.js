const express = require('express');
const User = require('../model').user;
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
// Authenticate the user and get a JSON Web Token to include in the header of future requests.
router.post('/authenticate', function (req, res) {
    User.findByName(req.body.name)
        .then(user => {
           
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // Create token if the password matched and no error was thrown
                    var token = jwt.sign(user, config.sessionSecret, {
                        expiresIn: 10080 // in seconds
                    });
                    res.json({ success: true, token: 'JWT ' + token });
                } else {
                    res.status(400);
                    res.json({ success: false, message: 'Authentication failed. Passwords did not match.' });
                }
            });
        })
        .catch(error => {
            res.status(404);
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        });
    
});
module.exports = router;