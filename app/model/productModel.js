'use strict';
var db = require('../db');


let create = function (name, cost, quantity) {

    var product = new db.productModel({
        name: name,
        cost: cost,
        inStock: quantity
    });
    return product.save();

}
let deleteById = function (productId) {
    return findById(productId)
        .then((product) => {
            product.active = false;
            return product.save();
        });

   // db.productModel.findByIdAndRemove(productId).exec();
};
//########### Queries ###########
let all = (sortField) => {
    let byPopularity = false;
    if (!sortField) {
        sortField = 'name';
    }
    if (sortField === 'popularity') {
        byPopularity = true;
        sortField = 'name';
    }
    return db.productModel.find({ active: true })
        .sort({ [sortField]: 1 })
        .exec()
        .then(products => {
            
            if (byPopularity) {
                products.sort(function (a, b) {
                    return b.likes.length - a.likes.length;
                });
            }
            return products;
        });

}
let filterByName = (name, sortField) => {
    if (!sortField) {
        sortField = 'name'
    }
    return db.productModel
        .find({ name: new RegExp(name, "i"),active:true })
        .sort({ [sortField]: 1 })
        .exec();
};
let findById = id => {
    return db.productModel
        .findById(id)
        .exec()
        .then(product => {
            if (!product || !product.active) {
                throw { statusCode: 404, message: "Product not found." };
            }
            return product;
        });
};
let findByName = name => {
    return db.productModel.findOne({ name: name })
        .exec()
        .then(product => {
            if (!product || !product.active) {
                throw { statusCode: 404, message: "Product not found." };
            }
            return product;
        });

};
// End ########### Queries ###########


//########### actions ###########

let buy = (productid, userid, quantity) => {


    return findById(productid)
        .then(product => {
            if (quantity <= 0) {
                throw "Product quantity should be >0.";
            }
            if (product.inStock >= quantity) {
                product.inStock -= quantity;
                return product.save()
            } else {
                throw "Not enough product in stock.";
            }
        })
        .then(product => {
            let phistory = new db.purchaseHistoryModel({
                userId: userid,
                productId: productid,
                quantity,
                unitCost: product.cost
            });
            return phistory.save()
                .then((h) => {
                    return product;
                });
        });


};

let toggleLikeById = (productId, userId) => {
    return findById(productId)
        .then((product) => {

            let index = product.likes.indexOf(userId);
            if (index > -1) {
                product.likes.splice(index, 1);

            } else {
                product.likes.push(userId);
            }
            return product.save();
        });
};
let likeById = (productId, userId, doLike) => {

    return findById(productId)
        .then((product) => {

            let index = product.likes.indexOf(userId);
            if (index > -1 && !doLike) {
                product.likes.splice(index, 1);
            } else if (index < 0 && doLike) {
                product.likes.push(userId);
            }
            return product.save();
        });
};

let setStockById = (productId, quantity) => {
    return findById(productId)
        .then((product) => {
            product.inStock = quantity;
            return product.save();
        });
};
let setCostById = (productId, userId, cost) => {
    let prevCost = 0;
    return findById(productId)
        .then((product) => {
            prevCost = product.cost;
            product.cost = cost;
            return product.save();
        })
        .then((product) => {
            let modified = new db.ProductPriceHistoryModel({
                modifiedBy: userId,
                productId: productId,
                prevCost: prevCost,
                newCost: cost
            });
            return modified.save();
        });;

};
//End########### actions ###########

module.exports = {
    create,
    deleteById,
    all,
    filterByName,
    findById,
    findByName,
    buy,
    toggleLikeById,
    likeById,
    setStockById,
    setCostById

};