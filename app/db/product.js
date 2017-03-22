var mongoose = require('mongoose');

// Schema defines how the data will be stored in MongoDB
var ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    cost: {
        type: Number,
        get: v => parseFloat(v).toFixed(2),
        set: v => parseFloat(v).toFixed(2),
        required: true,
        min: 0,
        default: 0
    },
    inStock: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        required: true,
        min: 0,
        default: 0
    },
    likes: []
});


module.exports = ProductSchema;