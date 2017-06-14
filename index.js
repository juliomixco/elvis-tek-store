'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const appmodules = require('./app');
const passport = require('passport');
const google = require('googleapis');
const gaConfig = require('./app/config/elvis-store-50f5c66baa8c.json')


app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  let jwtClient = new google.auth.JWT(
    gaConfig.client_email, null, gaConfig.private_key,
    ['https://www.googleapis.com/auth/analytics.readonly'], null);
  jwtClient.authorize(function (err, tokens) {
    if (err) {
      console.log(err);
      //return;
    }
    console.log('toeken:', tokens);
    res.render('index', { host: appmodules.config.host, gtoken: tokens.access_token});
  });
  
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Initialize passport for use
app.use(passport.initialize());


// Bring in defined Passport Strategy
appmodules.auth(passport);

app.use('/api', appmodules.router);


app.listen(app.get('port'), console.log('person service running on port ', app.get('port')));