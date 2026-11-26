// routes/recipe.js - Hardened Recipe Routes

const router = require("express").Router();
const { auth } = require("../db");
const { protect } = auth;
const {
  validateRecipe,
  validateComment,
  validateRating,
  validateObjectIdParam
} = require("../backend/middleware/validationMiddleware");
const { recipeCreationLimiter } = require("../backend/middleware/rateLimiter");
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  addRecipeComment,
  addRecipeRating,
  updateRecipe,
  deleteRecipe
} = require("../backend/controllers/recipeController");

// Public reading routes
router.get("/", getRecipes);
router.get("/:id", validateObjectIdParam("id"), getRecipeById);

// Authenticated creation and modification routes
router.post("/", protect, recipeCreationLimiter, validateRecipe, createRecipe);
router.put("/:id", protect, validateObjectIdParam("id"), validateRecipe, updateRecipe);
router.delete("/:id", protect, validateObjectIdParam("id"), deleteRecipe);

// Authenticated engagement sub-routes
router.post("/:id/comments", protect, validateObjectIdParam("id"), validateComment, addRecipeComment);
router.post("/:id/ratings", protect, validateObjectIdParam("id"), validateRating, addRecipeRating);

module.exports = router;
