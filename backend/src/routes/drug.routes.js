const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const drugController = require('../controllers/drug.controller');

// Get all drugs
router.get('/', protect, drugController.getAllDrugs);

// Add new drug
router.post('/', 
    protect, 
    authorize('admin', 'pharmacist'), 
    drugController.addDrug
);

// Update drug quantity
router.patch('/:drugId/quantity', 
    protect, 
    authorize('admin', 'pharmacist'), 
    drugController.updateQuantity
);

// Get low stock drugs
router.get('/low-stock', 
    protect, 
    authorize('admin', 'pharmacist'), 
    drugController.getLowStock
);

// Get expiring drugs
router.get('/expiring', 
    protect, 
    authorize('admin', 'pharmacist'), 
    drugController.getExpiringDrugs
);

module.exports = router; 