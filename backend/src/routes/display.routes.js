const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const displayController = require('../controllers/display.controller');

// Get all displays
router.get('/', protect, displayController.getAllDisplays);

// Get displays by department
router.get('/department/:department', protect, displayController.getDisplayByDepartment);

// Update display content
router.post('/:displayId/content', 
    protect, 
    authorize('admin', 'receptionist'), 
    displayController.updateContent
);

// Update display settings
router.patch('/:displayId/settings', 
    protect, 
    authorize('admin'), 
    displayController.updateSettings
);

// Clear display content
router.delete('/:displayId/content', 
    protect, 
    authorize('admin', 'receptionist'), 
    displayController.clearContent
);

module.exports = router; 