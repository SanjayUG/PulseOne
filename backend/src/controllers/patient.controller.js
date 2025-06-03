const Patient = require('../models/Patient');

// Get all patients
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json({
            success: true,
            data: patients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching patients',
            error: error.message
        });
    }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }
        res.json({
            success: true,
            data: patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching patient',
            error: error.message
        });
    }
};

// Create new patient
exports.createPatient = async (req, res) => {
    try {
        const patient = new Patient(req.body);
        await patient.save();
        
        res.status(201).json({
            success: true,
            message: 'Patient created successfully',
            data: patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating patient',
            error: error.message
        });
    }
};

// Update patient
exports.updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        res.json({
            success: true,
            message: 'Patient updated successfully',
            data: patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating patient',
            error: error.message
        });
    }
};

// Add medical history
exports.addMedicalHistory = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        patient.medicalHistory.push({
            ...req.body,
            date: new Date()
        });

        await patient.save();

        res.json({
            success: true,
            message: 'Medical history added successfully',
            data: patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding medical history',
            error: error.message
        });
    }
};

// Delete patient
exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        res.json({
            success: true,
            message: 'Patient deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting patient',
            error: error.message
        });
    }
}; 