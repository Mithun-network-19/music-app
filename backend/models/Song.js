const mongoose = require('mongoose');

/**
 * Song Schema Definition
 */
const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Song title is required'],
    trim: true
  },
  artist: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true
  },
  album: {
    type: String,
    default: 'Single',
    trim: true
  },
  genre: {
    type: String,
    default: 'Pop',
    trim: true
  },
  duration: {
    type: String,
    default: '3:30',
    trim: true
  },
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    trim: true
  },
  audioUrl: {
    type: String,
    required: [true, 'Audio URL is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Transform output to include cleaner JSON id field
songSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Song', songSchema);
