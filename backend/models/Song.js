const mongoose = require('mongoose');

/**
 * Mongoose Song Model Schema
 */
const songSchema = new mongoose.Schema(
  {
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
      required: [true, 'Audio URL stream is required'],
      trim: true
    },
    releaseYear: {
      type: Number,
      default: () => new Date().getFullYear()
    },
    language: {
      type: String,
      default: 'English',
      trim: true
    }
  },
  {
    timestamps: true // Automatically manages createdAt and updatedAt
  }
);

// Prevent duplicate songs with the exact same Title & Artist
songSchema.index({ title: 1, artist: 1 }, { unique: true });

// Transform output JSON format for clean API responses
songSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

module.exports = mongoose.model('Song', songSchema);
