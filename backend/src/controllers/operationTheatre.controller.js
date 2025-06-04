const OperationTheatre = require('../models/OperationTheatre');
const Surgery = require('../models/Surgery');

// Get all operation theatres
exports.getAllOTs = async (req, res) => {
    try {
        const ots = await OperationTheatre.find()
            .populate('currentSurgery')
            .populate('schedule.surgeryId');
        
        res.json({
            success: true,
            data: ots
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching operation theatres',
            error: error.message
        });
    }
};

// Get OT schedule
exports.getOTSchedule = async (req, res) => {
    try {
        const { otId } = req.params;
        const ot = await OperationTheatre.findById(otId)
            .populate('schedule.surgeryId');
        
        if (!ot) {
            return res.status(404).json({
                success: false,
                message: 'Operation theatre not found'
            });
        }

        res.json({
            success: true,
            data: ot.schedule
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching OT schedule',
            error: error.message
        });
    }
};

// Schedule surgery
exports.scheduleSurgery = async (req, res) => {
    try {
        const { otId } = req.params;
        const { surgeryId, startTime, endTime } = req.body;

        console.log('Scheduling surgery with params:', { otId, surgeryId, startTime, endTime });

        const ot = await OperationTheatre.findById(otId);
        if (!ot) {
            console.log('Operation theatre not found:', otId);
            return res.status(404).json({
                success: false,
                message: 'Operation theatre not found'
            });
        }

        console.log('Found operation theatre:', ot);

        // Validate surgery exists
        const surgery = await Surgery.findById(surgeryId);
        if (!surgery) {
            console.log('Surgery not found:', surgeryId);
            return res.status(404).json({
                success: false,
                message: 'Surgery not found'
            });
        }

        console.log('Found surgery:', surgery);

        // Check for scheduling conflicts
        const hasConflict = ot.schedule.some(schedule => {
            const scheduleStart = new Date(schedule.startTime);
            const scheduleEnd = new Date(schedule.endTime);
            const newStart = new Date(startTime);
            const newEnd = new Date(endTime);

            return (
                (newStart >= scheduleStart && newStart < scheduleEnd) ||
                (newEnd > scheduleStart && newEnd <= scheduleEnd)
            );
        });

        if (hasConflict) {
            console.log('Scheduling conflict detected');
            return res.status(400).json({
                success: false,
                message: 'Time slot conflicts with existing schedule'
            });
        }

        // Add to schedule
        ot.schedule.push({
            surgeryId,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            status: 'scheduled'
        });

        console.log('Saving operation theatre with new schedule');
        await ot.save();

        res.status(201).json({
            success: true,
            message: 'Surgery scheduled successfully',
            data: ot
        });
    } catch (error) {
        console.error('Error in scheduleSurgery:', error);
        res.status(500).json({
            success: false,
            message: 'Error scheduling surgery',
            error: error.message
        });
    }
};

// Update OT status
exports.updateOTStatus = async (req, res) => {
    try {
        const { otId } = req.params;
        const { status, currentSurgery } = req.body;

        const ot = await OperationTheatre.findById(otId);
        if (!ot) {
            return res.status(404).json({
                success: false,
                message: 'Operation theatre not found'
            });
        }

        ot.status = status;
        if (currentSurgery) {
            ot.currentSurgery = currentSurgery;
        }

        await ot.save();

        res.json({
            success: true,
            message: 'OT status updated successfully',
            data: ot
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating OT status',
            error: error.message
        });
    }
};

// Emergency protocol
exports.emergencyProtocol = async (req, res) => {
    try {
        const { otId } = req.params;
        const { surgeryId, priority } = req.body;

        const ot = await OperationTheatre.findById(otId);
        if (!ot) {
            return res.status(404).json({
                success: false,
                message: 'Operation theatre not found'
            });
        }

        // Clear current schedule for emergency
        ot.schedule = ot.schedule.filter(schedule => 
            schedule.status === 'completed' || schedule.status === 'cancelled'
        );

        // Add emergency surgery
        ot.status = 'emergency';
        ot.currentSurgery = surgeryId;
        ot.schedule.push({
            surgeryId,
            startTime: new Date(),
            endTime: null,
            status: 'in-progress'
        });

        await ot.save();

        res.json({
            success: true,
            message: 'Emergency protocol activated',
            data: ot
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error activating emergency protocol',
            error: error.message
        });
    }
}; 