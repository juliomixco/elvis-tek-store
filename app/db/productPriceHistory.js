var mongoose = require('mongoose');

// Schema defines how the data will be stored in MongoDB
let ProductPriceHistorySchema = new mongoose.Schema({
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    prevCost: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
        get: v => parseFloat(v).toFixed(2),
        set: v => parseFloat(v).toFixed(2),
    },
    newCost: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
        get: v => parseFloat(v).toFixed(2),
        set: v => parseFloat(v).toFixed(2),
    },
    inserted: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = ProductPriceHistorySchema;