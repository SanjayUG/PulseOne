const mongoose = require('mongoose');

const otSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true
  },
  surgeryType: {
    type: String,
    required: true
  },
  surgeonName: {
    type: String,
    required: true
  },
  otNumber: {
    type: String,
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('OT', otSchema); 