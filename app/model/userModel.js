'use strict';
var db = require('../db');


let create = function (name, password) {
    
        var user = new db.userModel({
            name: name,
            password: password
        });
        return user.save();
    
}
let findById = id => {
    return db.userModel.findById(id).exec();
   
};

let findByName = name => {
    return db.userModel.findOne({ name: name }).exec();
 
};
module.exports = {
    create,
    findById,
    findByName
};