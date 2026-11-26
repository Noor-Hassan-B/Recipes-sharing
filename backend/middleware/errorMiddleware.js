// backend/middleware/errorMiddleware.js
// Centralized, hardened error handling middleware

// Catches unmatched routes
const notFound = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode !== 200 ? res.statusCode : (err.status || 500);

  // Mongoose CastError (bad ObjectId)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    err.message = "Requested resource not found";
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    err.message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    err.message = `An entry with this ${field} already exists.`;
  }

  // Multer upload errors
  if (err.name === "MulterError") {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      err.message = "File exceeds the maximum allowed size of 5MB.";
    }
  }

  // CORS security error
  if (err.message && err.message.includes("CORS blocked")) {
    statusCode = 403;
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected error occurred.",
    // Never expose stack trace in production environments
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};

module.exports = { notFound, errorHandler };
