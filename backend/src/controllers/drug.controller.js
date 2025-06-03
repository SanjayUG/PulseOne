const Drug = require('../models/Drug');

// Get all drugs
exports.getAllDrugs = async (req, res) => {
    try {
        const drugs = await Drug.find();
        res.json({
            success: true,
            data: drugs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching drugs',
            error: error.message
        });
    }
};

// Add new drug
exports.addDrug = async (req, res) => {
    try {
        const drug = new Drug(req.body);
        await drug.save();
        
        res.status(201).json({
            success: true,
            message: 'Drug added successfully',
            data: drug
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding drug',
            error: error.message
        });
    }
};

// Update drug quantity
exports.updateQuantity = async (req, res) => {
    try {
        const { drugId } = req.params;
        const { quantity, operation } = req.body; // operation: 'add' or 'subtract'

        const drug = await Drug.findById(drugId);
        if (!drug) {
            return res.status(404).json({
                success: false,
                message: 'Drug not found'
            });
        }

        if (operation === 'add') {
            drug.quantity += quantity;
        } else if (operation === 'subtract') {
            if (drug.quantity < quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient quantity'
                });
            }
            drug.quantity -= quantity;
        }

        drug.lastRestocked = new Date();
        await drug.save();

        res.json({
            success: true,
            message: 'Drug quantity updated successfully',
            data: drug
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating drug quantity',
            error: error.message
        });
    }
};

// Get low stock drugs
exports.getLowStock = async (req, res) => {
    try {
        const lowStockDrugs = await Drug.find({
            $expr: { $lte: ['$quantity', '$minimumStock'] }
        });

        res.json({
            success: true,
            data: lowStockDrugs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching low stock drugs',
            error: error.message
        });
    }
};

// Get expiring drugs
exports.getExpiringDrugs = async (req, res) => {
    try {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const expiringDrugs = await Drug.find({
            expiryDate: { $lte: thirtyDaysFromNow }
        });

        res.json({
            success: true,
            data: expiringDrugs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching expiring drugs',
            error: error.message
        });
    }
}; 