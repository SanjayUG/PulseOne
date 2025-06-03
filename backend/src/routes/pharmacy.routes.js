const express = require('express');
const router = express.Router();
const { Medicine, Prescription } = require('../models/Pharmacy');

// Medicine routes
router.get('/medicines', async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ name: 1 });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/medicines', async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    const newMedicine = await medicine.save();
    res.status(201).json(newMedicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/medicines/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    Object.assign(medicine, req.body);
    const updatedMedicine = await medicine.save();
    res.json(updatedMedicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Prescription routes
router.get('/prescriptions', async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('medicines.medicine')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/prescriptions', async (req, res) => {
  try {
    const prescription = new Prescription(req.body);
    const newPrescription = await prescription.save();
    res.status(201).json(newPrescription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/prescriptions/:id/status', async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    prescription.status = req.body.status;
    prescription.updatedAt = Date.now();
    
    const updatedPrescription = await prescription.save();
    res.json(updatedPrescription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 