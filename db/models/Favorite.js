// gggg/db/models/Favorite.js
// Favorite Schema for bookmarked recipes

const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

favoriteSchema.index({ recipeId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
