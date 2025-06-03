const mongoose = require('mongoose');

const displayBoardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['token', 'ot', 'emergency', 'general'],
        required: true
    },
    content: [{
        type: {
            type: String,
            enum: ['token', 'message', 'alert', 'status'],
            required: true
        },
        data: mongoose.Schema.Types.Mixed,
        priority: {
            type: Number,
            default: 0
        },
        startTime: Date,
        endTime: Date,
        isActive: {
            type: Boolean,
            default: true
        }
    }],
    settings: {
        refreshInterval: {
            type: Number,
            default: 30 // seconds
        },
        displayMode: {
            type: String,
            enum: ['normal', 'emergency'],
            default: 'normal'
        },
        theme: {
            type: String,
            default: 'default'
        }
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Update lastUpdated timestamp before saving
displayBoardSchema.pre('save', function(next) {
    this.lastUpdated = Date.now();
    next();
});

module.exports = mongoose.model('DisplayBoard', displayBoardSchema); 