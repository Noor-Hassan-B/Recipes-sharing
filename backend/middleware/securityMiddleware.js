// backend/middleware/securityMiddleware.js
// Advanced HTTP Security Headers, NoSQL Injection Sanitization, and CORS Protection

const helmet = require("helmet");
const mongoSanitize = require("mongo-sanitize");
const cors = require("cors");

// Configure Helmet for Defense-in-Depth
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https://images.unsplash.com",
        "https://cdn.jsdelivr.net",
        "https://*.google.com",
        "https://*.gstatic.com"
      ],
      connectSrc: [
        "'self'",
        "http://localhost:5000",
        "http://localhost:5173",
        "http://127.0.0.1:5000",
        "http://127.0.0.1:5173"
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === "production" ? [] : null
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allows static images in /uploads to load across origins
  xContentTypeOptions: true, // Prevents MIME type sniffing
  xFrameOptions: { action: "deny" }, // Prevents clickjacking
  hidePoweredBy: true // Strips 'X-Powered-By: Express' to reduce reconnaissance footprint
});

// NoSQL Injection Sanitizer: recurses over req.body, req.query, and req.params to strip $ and . operators
const sanitizeInputs = (req, res, next) => {
  if (req.body) req.body = mongoSanitize(req.body);
  if (req.query) req.query = mongoSanitize(req.query);
  if (req.params) req.params = mongoSanitize(req.params);
  next();
};

// Strict CORS Whitelist Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
  : [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000"
    ];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, or local testing) where origin is undefined
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked request from unauthorized origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400 // Cache preflight response for 24 hours
};

module.exports = {
  helmetConfig,
  sanitizeInputs,
  corsOptions: cors(corsOptions)
};
