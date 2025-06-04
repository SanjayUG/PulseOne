const Department = require('../models/Department');

// Get all departments
const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.json({
            success: true,
            data: departments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching departments',
            error: error.message
        });
    }
};

// Get department by ID
const getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }
        res.json({
            success: true,
            data: department
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching department',
            error: error.message
        });
    }
};

// Create new department
const createDepartment = async (req, res) => {
    try {
        const department = new Department(req.body);
        await department.save();
        
        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            data: department
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating department',
            error: error.message
        });
    }
};

// Update department
const updateDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        res.json({
            success: true,
            message: 'Department updated successfully',
            data: department
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating department',
            error: error.message
        });
    }
};

// Delete department
const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);
        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        res.json({
            success: true,
            message: 'Department deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting department',
            error: error.message
        });
    }
};

module.exports = {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
}; 