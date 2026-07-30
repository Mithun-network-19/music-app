const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const songRoutes = require('./routes/songs');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables from .env
dotenv.config();

// Initialize Express App
const app = express();

// Connect to MongoDB Atlas
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files if hosted together
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/songs', songRoutes);

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'AuraSound Music Streaming REST API is active',
    timestamp: new Date().toISOString()
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Fallback route for frontend single page navigation
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API Endpoint Not Found' });
  }
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 Music Server running on port: ${PORT}`);
  console.log(`🎵 API Endpoint: http://localhost:${PORT}/api/songs`);
  console.log(`===================================================`);
});
