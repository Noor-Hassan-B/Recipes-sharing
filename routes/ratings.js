const router = require("express").Router();
const { Rating, auth } = require("../db");
const { protect } = auth;

// GET / - Get all ratings
router.get("/", async (req, res) => {
  try {
    const ratings = await Rating.find()
      .populate("user", "name email")
      .populate("recipe", "name");
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /recipe/:recipeId - Get ratings for a specific recipe
router.get("/recipe/:recipeId", async (req, res) => {
  try {
    const ratings = await Rating.find({ recipe: req.params.recipeId })
      .populate("user", "name email");
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST / - Add or update a rating
router.post("/", protect, async (req, res) => {
  try {
    const { recipe, recipeId, score } = req.body;
    const targetRecipe = recipe || recipeId;

    if (!targetRecipe || score === undefined) {
      return res.status(400).json({ success: false, message: "Please provide recipe ID and rating score (1-5)." });
    }

    const rating = await Rating.findOneAndUpdate(
      { recipe: targetRecipe, user: req.user._id },
      { score },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({ success: true, rating });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /:id - Delete rating
router.delete("/:id", protect, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({ success: false, message: "Rating not found" });
    }

    if (rating.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this rating." });
    }

    await rating.deleteOne();
    res.json({ success: true, message: "Rating deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
