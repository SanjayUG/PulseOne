const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const Surgery = require('../models/Surgery');

// Create a new surgery
router.post('/', protect, authorize('admin', 'doctor'), async (req, res) => {
    try {
        const surgery = new Surgery(req.body);
        await surgery.save();
        
        res.status(201).json({
            success: true,
            data: surgery
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating surgery',
            error: error.message
        });
    }
});

// Get all surgeries
router.get('/', protect, async (req, res) => {
    try {
        const surgeries = await Surgery.find();
        res.json({
            success: true,
            data: surgeries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching surgeries',
            error: error.message
        });
    }
});

// Get a single surgery
router.get('/:id', protect, async (req, res) => {
    try {
        const surgery = await Surgery.findById(req.params.id);
        if (!surgery) {
            return res.status(404).json({
                success: false,
                message: 'Surgery not found'
            });
        }
        res.json({
            success: true,
            data: surgery
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching surgery',
            error: error.message
        });
    }
});

// Update a surgery
router.put('/:id', protect, authorize('admin', 'doctor'), async (req, res) => {
    try {
        const surgery = await Surgery.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!surgery) {
            return res.status(404).json({
                success: false,
                message: 'Surgery not found'
            });
        }
        res.json({
            success: true,
            data: surgery
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating surgery',
            error: error.message
        });
    }
});

// Delete a surgery
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const surgery = await Surgery.findByIdAndDelete(req.params.id);
        if (!surgery) {
            return res.status(404).json({
                success: false,
                message: 'Surgery not found'
            });
        }
        res.json({
            success: true,
            message: 'Surgery deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting surgery',
            error: error.message
        });
    }
});

module.exports = router; 