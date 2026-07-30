const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const songRoutes = require('./routes/songs');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files if hosted together on Render
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/songs', songRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Music Streaming API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Fallback to index.html for SPA/frontend routes if needed
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API Endpoint Not Found' });
  }
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 Music Server running on port: ${PORT}`);
  console.log(`🎵 API Endpoint: http://localhost:${PORT}/api/songs`);
  console.log(`===================================================`);
});
