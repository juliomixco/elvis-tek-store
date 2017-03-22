var mongoose = require('mongoose');

// Schema defines how the data will be stored in MongoDB
let PurchaseHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    unitCost: {
    	type: Number,
    	required: true,
    	min: 0,
    	default: 0
    },
    inserted:{
    	type: Date,
    	required: true,
    	default: Date.now    
    }
});

module.exports = PurchaseHistorySchema;