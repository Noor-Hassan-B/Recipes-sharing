// backend/middleware/rateLimiter.js
// Rate Limiting to prevent Denial-of-Service (DoS) and Brute-Force credential attacks

const rateLimit = require("express-rate-limit");

// General API Rate Limiter: 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many requests from this IP address, please try again after 15 minutes."
  }
});

// Strict Auth Limiter (Login & Registration): 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS, 10) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  message: {
    success: false,
    message: "Too many authentication attempts from this IP. Please wait 15 minutes before trying again."
  }
});

// Recipe Creation Limiter: 20 recipe submissions per hour per IP to prevent spamming
const recipeCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Recipe creation limit reached for this hour. Please try again later."
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  recipeCreationLimiter
};
