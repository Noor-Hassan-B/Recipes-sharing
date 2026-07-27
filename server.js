const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./db");
const { notFound, errorHandler } = require("./backend/middleware/errorMiddleware");

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Serve uploaded static files (actual folder lives in backend/uploads)
app.use("/uploads", express.static(path.join(__dirname, "backend", "uploads")));

// Import Route Handlers
const userRoutes = require("./routes/users");
const recipeRoutes = require("./routes/recipe");
const categoryRoutes = require("./routes/categories");
const commentRoutes = require("./routes/comments");
const ratingRoutes = require("./routes/ratings");
const favoriteRoutes = require("./routes/favorites");
const uploadRoutes = require("./backend/routes/upload");

// Mount Routes (supporting both direct and /api prefixes)
app.use("/users", userRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", userRoutes); // /api/auth alias for user login & registration

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

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Recipe API with Authentication & MongoDB is running..."
  });
});

// 404 handler - must come after all valid routes
app.use(notFound);

// Global error handler - must be the last middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
