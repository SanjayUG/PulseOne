const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Routes
const tokenRoutes = require('./routes/token.routes');
const otRoutes = require('./routes/ot.routes');
const pharmacyRoutes = require('./routes/pharmacy.routes');
const displayBoardRoutes = require('./routes/displayBoard.routes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wenlock-hospital')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/tokens', tokenRoutes);
app.use('/api/ot', otRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/display-board', displayBoardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 