'use strict';
const config = require('../config');
const Mongoose = require('mongoose').connect(config.dbURI);
const User = require('./user');
const Product = require('./product');
const PurchaseHistory = require('./purchaseHistory');
const ProductPriceHistory = require('./productPriceHistory');


//native promise
Mongoose.Promise = global.Promise;
//Turn the schema into a usable model
let userModel = Mongoose.model('User', User);
let productModel = Mongoose.model('Product', Product);
let purchaseHistoryModel = Mongoose.model('PurchaseHistory', PurchaseHistory);
let ProductPriceHistoryModel = Mongoose.model('ProductPriceHistory', ProductPriceHistory);
module.exports = {
    Mongoose,
    userModel,
    productModel,
    purchaseHistoryModel,
    ProductPriceHistoryModel
    
};