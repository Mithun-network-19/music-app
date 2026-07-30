const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas / Local Database
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/music_db', {
      // Mongoose v6+ uses modern defaults automatically
    });
    console.log(`[MongoDB Connected]: Host -> ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.warn(`[Fallback Warning]: Backend running in mock database mode. Connect MongoDB URI in backend/.env for persistent Atlas storage.`);
    return false;
  }
};

module.exports = connectDB;
