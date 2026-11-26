// routes/ratings.js - Protected Rating Routes

const router = require("express").Router();
const { auth } = require("../db");
const { protect } = auth;
const {
  validateRating,
  validateObjectIdParam
} = require("../backend/middleware/validationMiddleware");
const {
  getRatings,
  getRatingsByRecipe,
  createOrUpdateRating,
  deleteRating
} = require("../backend/controllers/ratingController");

router.get("/", getRatings);
router.get("/recipe/:recipeId", validateObjectIdParam("recipeId"), getRatingsByRecipe);
router.post("/", protect, validateRating, createOrUpdateRating);
router.delete("/:id", protect, validateObjectIdParam("id"), deleteRating);

module.exports = router;
