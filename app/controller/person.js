'use strict';
var express = require('express')
    , router = express.Router();

var personal = [{ id: 1, name: 'lues' }, { id: 2, name: '3d' }];
router.get('/person', (req, res, next) => {
    res.status(200);
    res.set( { 'Content-Type': 'application/json' });
    res.json(personal);
});

router.post('/person', (req, res, next) => {
    var data = req.body;
    if (data) {
        personal.push(data);
        res.status(200);
        res.set({ 'Content-Type': 'application/json' });
        
        res.json(personal);
    } else {
        res.status(400).end();
    }
    
});

module.exports = router;