const express = require('express');
const router = express.Router();
const {
  getAllSongs,
  getSongById,
  createSong,
  uploadSong,
  updateSong,
  deleteSong,
  seedSongs
} = require('../controllers/songController');
const upload = require('../middleware/upload');

/**
 * @route   GET /api/songs
 * @desc    Get all songs (supports ?search=, ?artist=, ?album=, ?genre=)
 * @access  Public
 */
router.get('/', getAllSongs);

/**
 * @route   POST /api/songs/upload
 * @desc    Upload audio file & metadata to add new song
 * @access  Admin
 */
router.post('/upload', upload.fields([{ name: 'audioFile', maxCount: 1 }, { name: 'coverImageFile', maxCount: 1 }]), uploadSong);

/**
 * @route   POST /api/songs/seed
 * @desc    Seed database with sample songs
 * @access  Public
 */
router.post('/seed', seedSongs);


/**
 * @route   GET /api/songs/:id
 * @desc    Get single song by ID
 * @access  Public
 */
router.get('/:id', getSongById);

/**
 * @route   POST /api/songs
 * @desc    Add a new song
 * @access  Public
 */
router.post('/', createSong);

/**
 * @route   PUT /api/songs/:id
 * @desc    Update a song by ID
 * @access  Public
 */
router.put('/:id', updateSong);

/**
 * @route   DELETE /api/songs/:id
 * @desc    Delete a song by ID
 * @access  Public
 */
router.delete('/:id', deleteSong);

module.exports = router;
