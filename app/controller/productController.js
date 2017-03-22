'use strict';
const url = require('url');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const middleware = require('../middleware');
const Product = require('../model').Product;
function resolveProducts(req, res, promise) {
    promise.then((products) => {
        res.status(200);
        res.json(products);
    })
        .catch(error => {
            res.status(400);
            res.send({ message: error });
        });
}


router.get('/product/', function (req, res) {

    let sort = req.query.sort;
    let name = req.query.name;
    let products = [];
    if (name) {
        resolveProducts(req, res, Product.filterByName(name, sort));
           
    } else {
        resolveProducts(req, res, Product.all(sort));

    }

});
router.get('/product/:id', function (req, res) {

    Product.findById(req.params.id)
        .then(product => {
            res.status(200);
            res.json(product);
        })
        .catch(error => {
            res.status(400);
            res.send({ success: false, message: error });
        });

});
router.post('/product/', middleware.adminRequired, function (req, res) {
    let newProduct = req.body;
    let uri = url.parse(req.url);
    Product.create(newProduct.name, newProduct.cost, newProduct.quantity)
        .then(product => {
            res.status(201);
            res.set({ 'Location': `${uri.path}/${product._id}` });
            res.json(product);
        })
        .catch(error => {
            res.status(400);
            res.send({ success: false, message: error });
        });
});
router.delete('/product/:id', middleware.adminRequired, function (req, res) {
    
    Product.deleteById(req.params.id)
        .then(product => {
            if (product) {
                res.status(204);
                res.end();
            } else {
                res.status(404);
                res.end();
            }
            
        })
        .catch(error => {
            res.status(400);
            res.send({ success: false, message: error });
        });
});

router.patch('/product/:id/stock/:stock', middleware.adminRequired, function (req, res) {
    Product.setStockById(req.params.id, req.params.stock)
        .then(product => {
            res.status(200);
            res.send(product);
        })
        .catch(error => {
            res.status(400);
            res.json(error);
        });
});

router.patch('/product/:id/price/:price', middleware.adminRequired, function (req, res) {
    Product.setCostById(req.params.id,req.user._id, req.params.price)
        .then(product => {
            res.status(200);
            res.send(product);
        })
        .catch(error => {
            res.status(400);
            res.json(error);
        });
});

router.put('/product/:id/buy/:quantity', middleware.loginRequired, function (req, res) {

    Product.buy(req.params.id, req.user._id, req.params.quantity)
        .then((purchase) => {
            res.status(200);
            res.send({ success: false, message: purchase });
        })
        .catch(error => {
            res.status(400);
            res.send({ success: false, message: error });
        });

});

// like
router.put('/product/:id/like/', middleware.loginRequired, function (req, res) {
    like(true, req, res); 
});

//remove like
router.delete('/product/:id/like/', middleware.loginRequired, function (req, res) {
    like(false, req, res);
});
function like(doLike, req, res) {
    Product.likeById(req.params.id, req.user._id, doLike)
        .then((product) => {
            res.status(200);
            res.send(product);
        })
        .catch(error => {
            res.status(400);
            res.send({ success: false, message: error });
        });
}

module.exports = router;