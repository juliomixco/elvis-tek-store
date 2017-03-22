var db = require('../db');


exports.create = function (name, password) {
    return new Promise((resolve, reject) => {
        var user = new db.userModel({
            name: name,
            password: password
        });
        user.save((error) => {
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        });
    });   
}
exports.findById = id => {
    return new Promise((resolve, reject) => {
        db.userModel.findById(id, (error, user) => {
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        });
    });
};

exports.findByName = name => {
    return new Promise((resolve, reject) => {
        db.userModel.findOne({ name: name }, (error, user) => {
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        });
    });
};