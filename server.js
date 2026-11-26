// server.js - Hardened Express Server with Defense-in-Depth Cybersecurity

const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

// Load Environment Configuration
dotenv.config();

const { connectDB } = require("./db");
const { notFound, errorHandler } = require("./backend/middleware/errorMiddleware");
const { helmetConfig, sanitizeInputs, corsOptions } = require("./backend/middleware/securityMiddleware");
const { apiLimiter, authLimiter } = require("./backend/middleware/rateLimiter");

const app = express();

// 1. HTTP Security Headers via Helmet (CSP, HSTS, X-Content-Type-Options, etc.)
app.use(helmetConfig);

// 2. Strict Cross-Origin Resource Sharing (CORS) Configuration
app.use(corsOptions);

// 3. Request Body Size Limiting (DoS prevention)
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// 4. NoSQL Query Injection Sanitization ($ and . operator stripping)
app.use(sanitizeInputs);

// 5. Connect to MongoDB
connectDB();

// 6. Serve uploaded static files with security headers (nosniff)
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "backend", "uploads"))
);

// 7. Global API Rate Limiting
app.use("/api", apiLimiter);

// 8. Strict Rate Limiting on Authentication Endpoints
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/users/login", authLimiter);
app.use("/users/register", authLimiter);

// 9. Import Route Handlers
const userRoutes = require("./routes/users");
const recipeRoutes = require("./routes/recipe");
const categoryRoutes = require("./routes/categories");
const commentRoutes = require("./routes/comments");
const ratingRoutes = require("./routes/ratings");
const favoriteRoutes = require("./routes/favorites");
const uploadRoutes = require("./backend/routes/upload");

// 10. Mount Routes (supporting both direct and /api prefixes)
app.use("/users", userRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", userRoutes); // Alias for auth endpoints

app.use("/recipes", recipeRoutes);
app.use("/api/recipes", recipeRoutes);

app.use("/categories", categoryRoutes);
app.use("/api/categories", categoryRoutes);

app.use("/comments", commentRoutes);
app.use("/api/comments", commentRoutes);

app.use("/ratings", ratingRoutes);
app.use("/api/ratings", ratingRoutes);

app.use("/favorites", favoriteRoutes);
app.use("/api/favorites", favoriteRoutes);

app.use("/upload", uploadRoutes);
app.use("/api/upload", uploadRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FlavorCraft Recipe API with Enterprise Cybersecurity Hardening is running...",
    security: {
      helmet: "enabled",
      rateLimiter: "active",
      noSqlSanitizer: "active",
      csrfCspProtection: "active"
    }
  });
});

// 11. 404 handler - must come after all valid routes
app.use(notFound);

// 12. Global error handler - must be the last middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Secure Server running on http://localhost:${PORT}`);
});

module.exports = app;
