const Token = require('../models/Token');

// Get all tokens
exports.getAllTokens = async (req, res) => {
  try {
    const tokens = await Token.find().sort({ createdAt: -1 });
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new token
exports.createToken = async (req, res) => {
  try {
    const token = new Token(req.body);
    const newToken = await token.save();
    res.status(201).json(newToken);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update token status
exports.updateTokenStatus = async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }
    
    token.status = req.body.status;
    token.updatedAt = Date.now();
    
    const updatedToken = await token.save();
    res.json(updatedToken);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete token
exports.deleteToken = async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }
    
    await token.remove();
    res.json({ message: 'Token deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 