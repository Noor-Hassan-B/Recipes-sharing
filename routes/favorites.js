const router = require("express").Router();
const { Favorite, auth } = require("../db");
const { protect } = auth;

// GET / - Get all favorites
router.get("/", async (req, res) => {
  try {
    const favorites = await Favorite.find()
      .populate("user", "name email")
      .populate("recipe", "name cuisine image");
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /user/:userId - Get favorites for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.params.userId })
      .populate("recipe");
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST / - Add recipe to user's favorites
router.post("/", protect, async (req, res) => {
  try {
    const { recipe, recipeId } = req.body;
    const targetRecipe = recipe || recipeId;

    if (!targetRecipe) {
      return res.status(400).json({ success: false, message: "Please provide recipe ID." });
    }

    const favorite = await Favorite.findOneAndUpdate(
      { user: req.user._id, recipe: targetRecipe },
      { user: req.user._id, recipe: targetRecipe },
      { new: true, upsert: true }
    ).populate("recipe");

    res.status(201).json({ success: true, favorite });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /:id - Remove favorite
router.delete("/:id", protect, async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.id);

    if (!favorite) {
      return res.status(404).json({ success: false, message: "Favorite not found" });
    }

    if (favorite.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to remove this favorite." });
    }

    await favorite.deleteOne();
    res.json({ success: true, message: "Favorite removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
