const Emergency = require('../models/Emergency');

// Get all emergency cases
const getAllEmergencies = async (req, res) => {
    try {
        const emergencies = await Emergency.find()
            .populate('patientId')
            .populate('assignedDoctor')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: emergencies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching emergency cases',
            error: error.message
        });
    }
};

// Get emergency by ID
const getEmergencyById = async (req, res) => {
    try {
        const emergency = await Emergency.findById(req.params.id)
            .populate('patientId')
            .populate('assignedDoctor');
            
        if (!emergency) {
            return res.status(404).json({
                success: false,
                message: 'Emergency case not found'
            });
        }
        
        res.json({
            success: true,
            data: emergency
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching emergency case',
            error: error.message
        });
    }
};

// Create new emergency case
const createEmergency = async (req, res) => {
    try {
        const emergency = new Emergency(req.body);
        await emergency.save();
        
        res.status(201).json({
            success: true,
            message: 'Emergency case created successfully',
            data: emergency
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating emergency case',
            error: error.message
        });
    }
};

// Update emergency case
const updateEmergency = async (req, res) => {
    try {
        const emergency = await Emergency.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('patientId').populate('assignedDoctor');

        if (!emergency) {
            return res.status(404).json({
                success: false,
                message: 'Emergency case not found'
            });
        }

        res.json({
            success: true,
            message: 'Emergency case updated successfully',
            data: emergency
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating emergency case',
            error: error.message
        });
    }
};

// Add treatment to emergency case
const addTreatment = async (req, res) => {
    try {
        const emergency = await Emergency.findById(req.params.id);
        
        if (!emergency) {
            return res.status(404).json({
                success: false,
                message: 'Emergency case not found'
            });
        }

        emergency.treatment.push({
            ...req.body,
            timestamp: new Date()
        });

        await emergency.save();

        res.json({
            success: true,
            message: 'Treatment added successfully',
            data: emergency
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding treatment',
            error: error.message
        });
    }
};

// Update vital signs
const updateVitalSigns = async (req, res) => {
    try {
        const emergency = await Emergency.findByIdAndUpdate(
            req.params.id,
            { vitalSigns: req.body },
            { new: true, runValidators: true }
        );

        if (!emergency) {
            return res.status(404).json({
                success: false,
                message: 'Emergency case not found'
            });
        }

        res.json({
            success: true,
            message: 'Vital signs updated successfully',
            data: emergency
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating vital signs',
            error: error.message
        });
    }
};

module.exports = {
    getAllEmergencies,
    getEmergencyById,
    createEmergency,
    updateEmergency,
    addTreatment,
    updateVitalSigns
}; 