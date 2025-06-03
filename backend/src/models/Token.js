const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['normal', 'urgent', 'emergency'],
        default: 'normal'
    },
    status: {
        type: String,
        enum: ['waiting', 'in-progress', 'completed'],
        default: 'waiting'
    },
    tokenNumber: {
        type: String,
        unique: true,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Generate token number before saving
tokenSchema.pre('save', async function(next) {
    try {
        if (!this.isNew) {
            return next();
        }

        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        
        // Get count of tokens for today
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));
        
        const count = await this.constructor.countDocuments({
            createdAt: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });
        
        // Generate token number: YYMMDD-XXX
        this.tokenNumber = `${year}${month}${day}-${(count + 1).toString().padStart(3, '0')}`;
        this.updatedAt = new Date();
        next();
    } catch (error) {
        console.error('Error generating token number:', error);
        next(error);
    }
});

// Add index for tokenNumber
tokenSchema.index({ tokenNumber: 1 }, { unique: true });

module.exports = mongoose.model('Token', tokenSchema); 