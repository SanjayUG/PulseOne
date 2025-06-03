const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    supplier: {
        name: String,
        contact: String,
        email: String
    },
    minimumStock: {
        type: Number,
        required: true,
        default: 10
    },
    location: {
        type: String,
        required: true
    },
    batchNumber: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    lastRestocked: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['available', 'low-stock', 'out-of-stock'],
        default: 'available'
    }
});

// Update status based on quantity
drugSchema.pre('save', function(next) {
    if (this.quantity <= 0) {
        this.status = 'out-of-stock';
    } else if (this.quantity <= this.minimumStock) {
        this.status = 'low-stock';
    } else {
        this.status = 'available';
    }
    next();
});

module.exports = mongoose.model('Drug', drugSchema); 