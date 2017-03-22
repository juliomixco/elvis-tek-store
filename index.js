'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const appmodules = require('./app');
const passport = require('passport');


app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { host: appmodules.config.host})
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Initialize passport for use
app.use(passport.initialize());


// Bring in defined Passport Strategy
appmodules.auth(passport);

app.use('/api', appmodules.router);


app.listen(app.get('port'), console.log('person service running on port ', app.get('port')));