const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const emergencyController = require('../controllers/emergency.controller');

// Validation middleware
const emergencyValidation = [
    body('patientId').notEmpty().withMessage('Patient ID is required'),
    body('type').isIn(['trauma', 'cardiac', 'respiratory', 'neurological', 'other'])
        .withMessage('Invalid emergency type'),
    body('severity').isIn(['critical', 'severe', 'moderate', 'mild'])
        .withMessage('Invalid severity level'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('location').trim().notEmpty().withMessage('Location is required')
];

const treatmentValidation = [
    body('procedure').trim().notEmpty().withMessage('Procedure is required'),
    body('medication').trim().notEmpty().withMessage('Medication is required')
];

const vitalSignsValidation = [
    body('bloodPressure').trim().notEmpty().withMessage('Blood pressure is required'),
    body('heartRate').isNumeric().withMessage('Heart rate must be a number'),
    body('temperature').isNumeric().withMessage('Temperature must be a number'),
    body('oxygenSaturation').isNumeric().withMessage('Oxygen saturation must be a number'),
    body('respiratoryRate').isNumeric().withMessage('Respiratory rate must be a number')
];

// Routes
router.get('/', protect, emergencyController.getAllEmergencies);
router.get('/:id', protect, emergencyController.getEmergencyById);

router.post('/',
    protect,
    authorize('admin', 'doctor', 'nurse'),
    emergencyValidation,
    emergencyController.createEmergency
);

router.put('/:id',
    protect,
    authorize('admin', 'doctor'),
    emergencyValidation,
    emergencyController.updateEmergency
);

router.post('/:id/treatment',
    protect,
    authorize('admin', 'doctor'),
    treatmentValidation,
    emergencyController.addTreatment
);

router.put('/:id/vital-signs',
    protect,
    authorize('admin', 'doctor', 'nurse'),
    vitalSignsValidation,
    emergencyController.updateVitalSigns
);

module.exports = router; 