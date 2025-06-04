const mongoose = require('mongoose');

const surgerySchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true
    },
    procedure: {
        type: String,
        required: true
    },
    surgeon: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['normal', 'urgent', 'emergency'],
        default: 'normal'
    },
    estimatedDuration: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamps before saving
surgerySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Surgery', surgerySchema); 