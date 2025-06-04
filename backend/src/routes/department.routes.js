const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const departmentController = require('../controllers/department.controller');

// Validation middleware
const departmentValidation = [
    body('name').trim().notEmpty().withMessage('Department name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('head').trim().notEmpty().withMessage('Department head is required'),
    body('location').trim().notEmpty().withMessage('Location is required')
];

// Routes
router.get('/', protect, departmentController.getAllDepartments);
router.get('/:id', protect, departmentController.getDepartmentById);

router.post('/',
    protect,
    authorize('admin'),
    departmentValidation,
    departmentController.createDepartment
);

router.put('/:id',
    protect,
    authorize('admin'),
    departmentValidation,
    departmentController.updateDepartment
);

router.delete('/:id',
    protect,
    authorize('admin'),
    departmentController.deleteDepartment
);

module.exports = router; 