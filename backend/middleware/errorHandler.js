/**
 * Centralized Error Handling Middleware for Express
 */
const errorHandler = (err, req, res, next) => {
  console.error('[Error Details]:', err);

  let error = { ...err };
  error.message = err.message;

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with ID of ${err.value}`;
    return res.status(400).json({ success: false, message });
  }

  // Mongoose Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue).join(', ');
    const message = `Duplicate field value entered for [${fields}]. A song with this title and artist already exists.`;
    return res.status(409).json({ success: false, message });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(400).json({ success: false, message });
  }

  // Default Fallback Server Error
  res.status(err.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
