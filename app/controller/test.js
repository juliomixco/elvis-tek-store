'use strict';
const express = require('express');
const passport = require('passport');
const router = express.Router();
const middleware = require('../middleware');

// Protect action route with JWT
router.get('/test', middleware.adminRequired, function (req, res) {
    res.status(200);
    res.send('It worked! User id is: ' + req.user._id + '. User name is: '+ req.user.name);
});

module.exports = router;