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

// Middleware to extract user from token if provided, but pass through if omitted
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = auth.verifyToken(token);
      const { User } = require("../db");
      req.user = await User.findById(decoded.id).select("-password");
    } catch (e) {
      // ignore invalid token and continue
    }
  }
  next();
};

router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.post("/", optionalAuth, createRecipe);
router.post("/:id/comments", optionalAuth, addRecipeComment);
router.post("/:id/ratings", optionalAuth, addRecipeRating);
router.put("/:id", protect, updateRecipe);
router.delete("/:id", protect, deleteRecipe);

module.exports = router;
