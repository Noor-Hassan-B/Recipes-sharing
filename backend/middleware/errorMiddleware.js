// backend/middleware/errorMiddleware.js
// Centralized error handling: 404 (Not Found) + global error handler

// Catches any request that didn't match a route above it in server.js
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

// Must be the LAST middleware mounted in server.js (4 args = Express error handler)
const errorHandler = (err, req, res, next) => {
  // If a route already set a status code (e.g. 400/401/403), keep it;
  // otherwise default to 500 for unexpected errors.
  let statusCode = res.statusCode !== 200 ? res.statusCode : (err.status || 500);

  // Mongoose bad ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    err.message = "Resource not found";
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    err.message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    err.message = `Duplicate value for field: ${field}`;
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};

module.exports = { notFound, errorHandler };
