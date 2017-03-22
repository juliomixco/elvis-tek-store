'use strict';
const express = require('express')
const router = express.Router();


router.use('/', require('./person'),
    require('./authController'),
    require('./registerController'),
    require('./productController'),
    require('./test'));

module.exports = router;