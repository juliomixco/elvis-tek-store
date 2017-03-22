var db = require('../db');


exports.create = function (name, cost, quantity) {
    return new Promise((resolve, reject) => {
        var product = new db.productModel({
            name: name,
            cost: cost,
            inStock: quantity
        });
        product.save((error) => {
            if (error) {
                reject(error);
            } else {
                resolve(product);
            }
        });
    });
}
exports.deleteById = function (productId) {
    return new Promise((resolve, reject) => {
        db.productModel.findByIdAndRemove(productId, function (err, product) {
            if (err) {
                return reject(err);
            }
            resolve(product);
        });
    });
};
//########### Queries ###########
exports.all = (sortField) => {
    let byPopularity = false;
    if (!sortField) {
        sortField = 'name';
    }
    if (sortField === 'popularity') {
        byPopularity = true;
        sortField = 'name';
    }
    return new Promise((resolve, reject) => {
        db.productModel.find().sort({ [sortField]: 1 }).exec((error, products) => {
            if (error) {
                reject(error);
            } else {
                if (byPopularity) {
                    products.sort(function (a, b) {
                        return b.likes.length - a.likes.length;
                    });
                }
                resolve(products);
            }
        });
    });

}
exports.filterByName = (name, sortField) => {
    if (!sortField) {
        sortField = 'name'
    }
    return new Promise((resolve, reject) => {
        db.productModel.find({ name: new RegExp(name, "i") }).sort({ [sortField]: 1 }).exec((error, products) => {
            if (error) {
                reject(error);
            } else {
                resolve(products);
            }
        });
    });
};
exports.findById = id => {
    return new Promise((resolve, reject) => {
        db.productModel.findById(id, (error, product) => {
            if (error) {
                reject(error);
            } else {
                resolve(product);
            }
        });
    });
};
exports.findByName = name => {
    return new Promise((resolve, reject) => {
        db.productModel.findOne({ name: name }, (error, product) => {
            if (error) {
                reject(error);
            } else {
                resolve(product);
            }
        });
    });
};
// End ########### Queries ###########


//########### actions ###########

exports.buy = (productid, userid, quantity) => {
    return new Promise((resolve, reject) => {
        if (quantity <= 0) {
            reject("Product quantity should be >0.");
        }
        this.findById(productid)
            .then((product) => {
                if (!product) {
                    reject("Product not found.");
                }

                if (product.inStock >= quantity) {
                    product.inStock -= quantity;
                    product.save((error) => {
                        if (error) {
                            reject(error);
                        } else {
                            let phistory = new db.purchaseHistoryModel({
                                userId: userid,
                                productId: productid,
                                quantity,
                                unitCost: product.cost
                            });
                            phistory.save((error) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(product)
                                }
                            });
                        }
                    });
                } else {
                    reject("Not enough product in stock.");
                }
            })
            .catch((error) => {
                reject(error);
            });

    });
};

exports.toggleLikeById = (productId, userId) => {
    return new Promise((resolve, reject) => {

        this.findById(productId)
            .then((product) => {
                let index = product.likes.indexOf(userId);
                if (index > -1) {
                    product.likes.splice(index, 1);

                } else {
                    product.likes.push(userId);
                }
                product.save((error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(product);
                    }
                });
            })
            .catch(error => {
                reject(error);
            });


    });
};
exports.likeById = (productId, userId, doLike) => {
    
    return new Promise((resolve, reject) => {

        this.findById(productId)
            .then((product) => {
                let index = product.likes.indexOf(userId);
                if (index > -1 && !doLike) {
                    product.likes.splice(index, 1);
                } else if (index<0 && doLike) {
                    product.likes.push(userId);
                }
                product.save((error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(product);
                    }
                });
            })
            .catch(error => {
                reject(error);
            });


    });
};

exports.setStockById = (productId, quantity) => {
    return new Promise((resolve, reject) => {
        this.findById(productId)
            .then((product) => {
                product.inStock = quantity;
                product.save((err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(product);
                });
            })
            .catch((err) => {
                reject(err);
            });
    });
};
exports.setCostById = (productId,userId, cost) => {
    return new Promise((resolve, reject) => {
        this.findById(productId)
            .then((product) => {
                let prevCost = product.cost;
                product.cost = cost;
                product.save((err) => {
                    if (err) {
                        return reject(err);
                    }
                    let modified = new db.ProductPriceHistoryModel({
                        modifiedBy: userId,
                        productId: productId,
                        prevCost: prevCost,
                        newCost: cost
                    });
                    modified.save(err=>{
                        if(err) {
                            return reject(err);
                        }
                        resolve(product);
                    });   
                });
            })
            .catch((err) => {
                reject(err);
            });
    });
};
//End########### actions ###########