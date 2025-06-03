const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'Patient ID is required']
    },
    type: {
        type: String,
        required: [true, 'Emergency type is required'],
        enum: ['trauma', 'cardiac', 'respiratory', 'neurological', 'other']
    },
    severity: {
        type: String,
        required: [true, 'Severity level is required'],
        enum: ['critical', 'severe', 'moderate', 'mild']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    assignedDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'in-progress', 'stabilized', 'discharged', 'transferred'],
        default: 'pending'
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    vitalSigns: {
        bloodPressure: String,
        heartRate: Number,
        temperature: Number,
        oxygenSaturation: Number,
        respiratoryRate: Number
    },
    treatment: [{
        procedure: String,
        medication: String,
        notes: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    notes: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Emergency', emergencySchema); 