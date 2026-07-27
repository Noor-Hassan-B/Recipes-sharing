const router = require("express").Router();
const { auth } = require("../db");
const { protect } = auth;
const {
  getRatings,
  getRatingsByRecipe,
  createOrUpdateRating,
  deleteRating
} = require("../backend/controllers/ratingController");

router.get("/", getRatings);
router.get("/recipe/:recipeId", getRatingsByRecipe);
router.post("/", protect, createOrUpdateRating);
router.delete("/:id", protect, deleteRating);

module.exports = router;
