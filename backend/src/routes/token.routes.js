const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { body, validationResult } = require('express-validator');
const Token = require('../models/Token');

// Validation middleware
const tokenValidation = [
    body('patientName').trim().notEmpty().withMessage('Patient name is required'),
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('priority').isIn(['normal', 'urgent', 'emergency']).withMessage('Invalid priority')
];

// Get all tokens
router.get('/', protect, async (req, res) => {
    try {
        const tokens = await Token.find()
            .sort({ createdAt: -1 });
        
        res.json(tokens);
    } catch (error) {
        console.error('Error fetching tokens:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tokens',
            error: error.message
        });
    }
});

// Get tokens by department
router.get('/department/:department', protect, async (req, res) => {
    try {
        const tokens = await Token.find({ 
            department: req.params.department,
            status: { $ne: 'completed' }
        })
        .populate('patientId')
        .sort({ priority: -1, createdAt: 1 });
        
        res.json({
            success: true,
            data: tokens
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching department tokens',
            error: error.message
        });
    }
});

// Create new token
router.post('/', protect, tokenValidation, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors.array()
            });
        }

        console.log('Creating token with data:', req.body);

        const token = new Token({
            patientName: req.body.patientName,
            department: req.body.department,
            priority: req.body.priority || 'normal'
        });
        
        console.log('Token object created:', token);

        const savedToken = await token.save();
        console.log('Token saved successfully:', savedToken);
        
        res.status(201).json(savedToken);
    } catch (error) {
        console.error('Error creating token:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating token',
            error: error.message
        });
    }
});

// Update token status
router.patch('/:id', protect, async (req, res) => {
    try {
        const token = await Token.findById(req.params.id);
        
        if (!token) {
            return res.status(404).json({
                success: false,
                message: 'Token not found'
            });
        }

        if (req.body.status) {
            token.status = req.body.status;
        }

        const updatedToken = await token.save();
        res.json(updatedToken);
    } catch (error) {
        console.error('Error updating token:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating token',
            error: error.message
        });
    }
});

module.exports = router; 