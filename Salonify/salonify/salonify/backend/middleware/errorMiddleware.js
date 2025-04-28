/**
 * Error Handling Middleware
 */

// Middleware for handling 404 - Not Found
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Custom error handler
const errorHandler = (err, req, res, next) => {
  // Set status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);
  
  // Send detailed error in development, sanitized in production
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    error: {
      statusCode,
      name: err.name,
      ...(process.env.NODE_ENV !== 'production' && { details: err })
    }
  });
};

module.exports = { notFound, errorHandler }; 