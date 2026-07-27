const router = require("express").Router();
const { auth } = require("../db");
const { protect } = auth;
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  addRecipeComment,
  addRecipeRating,
  updateRecipe,
  deleteRecipe
} = require("../backend/controllers/recipeController");

router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.post("/", protect, createRecipe);
router.post("/:id/comments", protect, addRecipeComment);
router.post("/:id/ratings", protect, addRecipeRating);
router.put("/:id", protect, updateRecipe);
router.delete("/:id", protect, deleteRecipe);

module.exports = router;
