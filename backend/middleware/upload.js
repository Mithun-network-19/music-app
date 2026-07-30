const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  // Allowed extensions
  const allowedExtensions = /jpeg|jpg|png|gif|mp3|wav|m4a|ogg|aac|mpeg/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  
  // Allowed MIME types
  const allowedMimeTypes = /image\/(jpeg|jpg|png|gif)|audio\/(mpeg|mp3|wav|x-wav|ogg|mp4|aac|x-m4a)/;
  const mimetype = allowedMimeTypes.test(file.mimetype);

  // Accept if extension is valid OR mimetype is valid (more lenient)
  if (extname || mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only audio files (MP3, WAV, M4A, OGG, AAC) and image files (JPG, PNG, GIF) are allowed!'));
  }
};

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 50000000 }, // 50MB max file size
  fileFilter: fileFilter
});

module.exports = upload;
