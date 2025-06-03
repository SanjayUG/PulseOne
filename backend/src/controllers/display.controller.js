const DisplayBoard = require('../models/DisplayBoard');

// Get all display boards
exports.getAllDisplays = async (req, res) => {
    try {
        const displays = await DisplayBoard.find();
        res.json({
            success: true,
            data: displays
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching display boards',
            error: error.message
        });
    }
};

// Get display board by department
exports.getDisplayByDepartment = async (req, res) => {
    try {
        const { department } = req.params;
        const displays = await DisplayBoard.find({ department });
        
        res.json({
            success: true,
            data: displays
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching display boards',
            error: error.message
        });
    }
};

// Update display content
exports.updateContent = async (req, res) => {
    try {
        const { displayId } = req.params;
        const { content } = req.body;

        const display = await DisplayBoard.findById(displayId);
        if (!display) {
            return res.status(404).json({
                success: false,
                message: 'Display board not found'
            });
        }

        // Add new content
        display.content.push({
            ...content,
            startTime: new Date(),
            isActive: true
        });

        // Sort content by priority
        display.content.sort((a, b) => b.priority - a.priority);

        await display.save();

        res.json({
            success: true,
            message: 'Display content updated successfully',
            data: display
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating display content',
            error: error.message
        });
    }
};

// Update display settings
exports.updateSettings = async (req, res) => {
    try {
        const { displayId } = req.params;
        const { settings } = req.body;

        const display = await DisplayBoard.findById(displayId);
        if (!display) {
            return res.status(404).json({
                success: false,
                message: 'Display board not found'
            });
        }

        display.settings = {
            ...display.settings,
            ...settings
        };

        await display.save();

        res.json({
            success: true,
            message: 'Display settings updated successfully',
            data: display
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating display settings',
            error: error.message
        });
    }
};

// Clear display content
exports.clearContent = async (req, res) => {
    try {
        const { displayId } = req.params;
        const { type } = req.query; // Optional: clear specific type of content

        const display = await DisplayBoard.findById(displayId);
        if (!display) {
            return res.status(404).json({
                success: false,
                message: 'Display board not found'
            });
        }

        if (type) {
            display.content = display.content.filter(item => item.type !== type);
        } else {
            display.content = [];
        }

        await display.save();

        res.json({
            success: true,
            message: 'Display content cleared successfully',
            data: display
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error clearing display content',
            error: error.message
        });
    }
}; 