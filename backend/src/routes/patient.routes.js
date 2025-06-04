const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const patientController = require('../controllers/patient.controller');

// Validation middleware
const patientValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('age').isInt({ min: 0 }).withMessage('Age must be a positive number'),
    body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
    body('contact').trim().notEmpty().withMessage('Contact is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('bloodGroup').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood group')
];

const medicalHistoryValidation = [
    body('condition').trim().notEmpty().withMessage('Condition is required'),
    body('diagnosis').trim().notEmpty().withMessage('Diagnosis is required'),
    body('treatment').trim().notEmpty().withMessage('Treatment is required')
];

// Routes
router.get('/', protect, patientController.getAllPatients);
router.get('/:id', protect, patientController.getPatientById);

router.post('/',
    protect,
    authorize('admin', 'doctor', 'receptionist'),
    patientValidation,
    patientController.createPatient
);

router.put('/:id',
    protect,
    authorize('admin', 'doctor'),
    patientValidation,
    patientController.updatePatient
);

router.post('/:id/medical-history',
    protect,
    authorize('admin', 'doctor'),
    medicalHistoryValidation,
    patientController.addMedicalHistory
);

router.delete('/:id',
    protect,
    authorize('admin'),
    patientController.deletePatient
);

module.exports = router; 