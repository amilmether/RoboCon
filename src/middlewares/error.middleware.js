/**
 * Centralized error handler — returns JSON and maps common errors to HTTP codes.
 * We keep the payload small and friendly so clients can display it directly to users.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  // Log with stack when available; in production keep logs minimal
  if (process.env.NODE_ENV === 'production') {
    console.error(err.message);
  } else {
    console.error(err.stack || err);
  }

  // Invalid ObjectId or not found
  if (err.name === 'CastError') {
    return res.status(404).json({ success: false, message: 'Could not find a resource with that ID' });
  }

  // Schema validation issues from Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  // Fallback — prefer the explicit statusCode when set
  const statusCode = err.statusCode || 500;
  const message = err.message || (statusCode === 500 ? 'Something went wrong on our side' : 'An error occurred');

  const payload = { success: false, message };

  // Include stack trace in non-production environments for easier debugging
  if (process.env.NODE_ENV !== 'production') payload.stack = err.stack;

  return res.status(statusCode).json(payload);
}

module.exports = errorHandler;
