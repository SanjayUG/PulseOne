const express = require('express');
const router = express.Router();
const Token = require('../models/Token');
const OT = require('../models/OT');

// Get current tokens for display
router.get('/tokens', async (req, res) => {
  try {
    const tokens = await Token.find({
      status: { $in: ['waiting', 'in-progress'] }
    }).sort({ createdAt: 1 });
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current OT schedules for display
router.get('/ot-schedules', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const schedules = await OT.find({
      scheduledDate: {
        $gte: today
      },
      status: { $in: ['scheduled', 'in-progress'] }
    }).sort({ scheduledDate: 1, startTime: 1 });
    
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 