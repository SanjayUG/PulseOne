const express = require('express');
const router = express.Router();
const OT = require('../models/OT');

// Get all OT schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await OT.find().sort({ scheduledDate: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new OT schedule
router.post('/', async (req, res) => {
  try {
    const otSchedule = new OT(req.body);
    const newSchedule = await otSchedule.save();
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update OT schedule
router.patch('/:id', async (req, res) => {
  try {
    const schedule = await OT.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'OT schedule not found' });
    }
    
    Object.assign(schedule, req.body);
    schedule.updatedAt = Date.now();
    
    const updatedSchedule = await schedule.save();
    res.json(updatedSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete OT schedule
router.delete('/:id', async (req, res) => {
  try {
    const schedule = await OT.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'OT schedule not found' });
    }
    
    await schedule.deleteOne();
    res.json({ message: 'OT schedule deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 