const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/token.controller');

// Get all tokens
router.get('/', tokenController.getAllTokens);

// Create new token
router.post('/', tokenController.createToken);

// Update token status
router.patch('/:id/status', tokenController.updateTokenStatus);

// Delete token
router.delete('/:id', tokenController.deleteToken);

module.exports = router; 