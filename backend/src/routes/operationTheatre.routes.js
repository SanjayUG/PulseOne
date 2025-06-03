const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const operationTheatreController = require('../controllers/operationTheatre.controller');

// Get all OTs
router.get('/', protect, operationTheatreController.getAllOTs);

// Get OT schedule
router.get('/:otId/schedule', protect, operationTheatreController.getOTSchedule);

// Schedule surgery
router.post('/:otId/schedule', 
    protect, 
    authorize('admin', 'doctor'), 
    operationTheatreController.scheduleSurgery
);

// Update OT status
router.patch('/:otId/status', 
    protect, 
    authorize('admin', 'doctor', 'nurse'), 
    operationTheatreController.updateOTStatus
);

// Emergency protocol
router.post('/:otId/emergency', 
    protect, 
    authorize('admin', 'doctor'), 
    operationTheatreController.emergencyProtocol
);

module.exports = router; 