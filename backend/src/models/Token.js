const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  tokenNumber: {
    type: String,
    required: true,
    unique: true
  },
  patientName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'in-progress', 'completed'],
    default: 'waiting'
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

module.exports = mongoose.model('Token', tokenSchema); 