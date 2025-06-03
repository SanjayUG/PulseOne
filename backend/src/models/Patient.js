const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true
    },
    medicalHistory: [{
        condition: String,
        diagnosis: String,
        treatment: String,
        date: Date
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Patient', patientSchema); 