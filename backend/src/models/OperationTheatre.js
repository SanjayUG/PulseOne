const mongoose = require('mongoose');

const operationTheatreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'maintenance', 'emergency'],
        default: 'available'
    },
    currentSurgery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Surgery',
        default: null
    },
    schedule: [{
        surgeryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Surgery'
        },
        startTime: Date,
        endTime: Date,
        status: {
            type: String,
            enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
            default: 'scheduled'
        }
    }],
    equipment: [{
        name: String,
        status: {
            type: String,
            enum: ['available', 'in-use', 'maintenance'],
            default: 'available'
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Update lastUpdated timestamp before saving
operationTheatreSchema.pre('save', function(next) {
    this.lastUpdated = Date.now();
    next();
});

module.exports = mongoose.model('OperationTheatre', operationTheatreSchema); 