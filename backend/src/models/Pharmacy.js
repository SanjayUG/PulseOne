const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  genericName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  expiryDate: {
    type: Date,
    required: true
  }
});

const prescriptionSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  medicines: [{
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true
    },
    dosage: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'dispensed', 'cancelled'],
    default: 'pending'
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

const Medicine = mongoose.model('Medicine', medicineSchema);
const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = { Medicine, Prescription }; 