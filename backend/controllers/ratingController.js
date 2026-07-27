// backend/controllers/ratingController.js
const { Rating } = require("../../db");

// GET / - Get all ratings
const getRatings = async (req, res) => {
  try {
    const ratings = await Rating.find()
      .populate("userId", "name email")
      .populate("recipeId", "title");
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /recipe/:recipeId - Get ratings for a specific recipe
const getRatingsByRecipe = async (req, res) => {
  try {
    const ratings = await Rating.find({ recipeId: req.params.recipeId })
      .populate("userId", "name email");
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST / - Add or update a rating
const createOrUpdateRating = async (req, res) => {
  try {
    const { recipe, recipeId, score } = req.body;
    const targetRecipe = recipe || recipeId;

    if (!targetRecipe || score === undefined) {
      return res.status(400).json({ success: false, message: "Please provide recipe ID and rating score (1-5)." });
    }

    const rating = await Rating.findOneAndUpdate(
      { recipeId: targetRecipe, userId: req.user._id },
      { rating: score },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({ success: true, rating });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /:id - Delete rating
const deleteRating = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({ success: false, message: "Rating not found" });
    }

    if (rating.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this rating." });
    }

    await rating.deleteOne();
    res.json({ success: true, message: "Rating deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getRatings, getRatingsByRecipe, createOrUpdateRating, deleteRating };
