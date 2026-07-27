// backend/controllers/favoriteController.js
const { Favorite } = require("../../db");

// GET / - Get all favorites
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find()
      .populate("userId", "name email")
      .populate("recipeId", "title category image");
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /user/:userId - Get favorites for a specific user
const getFavoritesByUser = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId })
      .populate("recipeId");
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST / - Add recipe to user's favorites
const addFavorite = async (req, res) => {
  try {
    const { recipe, recipeId } = req.body;
    const targetRecipe = recipe || recipeId;

    if (!targetRecipe) {
      return res.status(400).json({ success: false, message: "Please provide recipe ID." });
    }

    const favorite = await Favorite.findOneAndUpdate(
      { userId: req.user._id, recipeId: targetRecipe },
      { userId: req.user._id, recipeId: targetRecipe },
      { new: true, upsert: true }
    ).populate("recipeId");

    res.status(201).json({ success: true, favorite });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /:id - Remove favorite
const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.id);

    if (!favorite) {
      return res.status(404).json({ success: false, message: "Favorite not found" });
    }

    if (favorite.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to remove this favorite." });
    }

    await favorite.deleteOne();
    res.json({ success: true, message: "Favorite removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFavorites, getFavoritesByUser, addFavorite, removeFavorite };
