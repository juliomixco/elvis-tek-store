'use strict';
const passport = require('passport');

function unauthorized(req, res) {
    res.status(401);
    res.send("UNAUTHORIZED");
}
// Protect dashboard route with JWT
let adminRequired = (req, res, next) => {
    //passport.authenticate('jwt', { session: false }), function (req, res) {
    //    let user = req.user;
    //    if (user.role === 'Admin') {
    //        next()
    //    } else {
    //        res.status(401);
    //        res.send("UNAUTHORIZED");
    //    }    
    //}

    passport.authenticate('jwt', { session: false }, function (err, payload, info) {

        if (err) { return next(err); }
        if (!payload) { return unauthorized(req, res); }
        let user = payload._doc;
        if (user.role === 'Admin') {
            req.user = user;
            next();
        } else {
            return unauthorized(req, res);
        }


    })(req, res, next)

};

let loginRequired = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, function (err, payload, info) {

        if (err) { return next(err); }
        if (!payload) { return unauthorized(req, res); }
        let user = payload._doc;

        req.user = user;
        next();
    })(req, res, next);
};


module.exports = {
    adminRequired,
    loginRequired
};