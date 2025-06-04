const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const operationTheatreController = require('../controllers/operationTheatre.controller');
const OperationTheatre = require('../models/OperationTheatre');

// Initialize operation theatre if it doesn't exist
router.post('/initialize', protect, authorize('admin'), async (req, res) => {
    try {
        // Check if OT already exists
        let ot = await OperationTheatre.findOne({ name: 'OT-1' });
        
        if (!ot) {
            // Create new OT
            ot = new OperationTheatre({
                name: 'OT-1',
                status: 'available',
                equipment: [
                    { name: 'Anesthesia Machine', status: 'available' },
                    { name: 'Surgical Lights', status: 'available' },
                    { name: 'Patient Monitor', status: 'available' }
                ]
            });
            await ot.save();
        }
        
        res.json({
            success: true,
            message: 'Operation theatre initialized',
            data: ot
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error initializing operation theatre',
            error: error.message
        });
    }
});

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