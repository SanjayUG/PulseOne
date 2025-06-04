const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const patientRoutes = require('./routes/patient.routes');
const tokenRoutes = require('./routes/token.routes');
const operationTheatreRoutes = require('./routes/operationTheatre.routes');
const drugRoutes = require('./routes/drug.routes');
const departmentRoutes = require('./routes/department.routes');
const emergencyRoutes = require('./routes/emergency.routes');
const displayRoutes = require('./routes/display.routes');
const surgeryRoutes = require('./routes/surgery.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wenlock-hospital', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/operation-theatre', operationTheatreRoutes);
app.use('/api/drugs', drugRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/display', displayRoutes);
app.use('/api/surgeries', surgeryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
