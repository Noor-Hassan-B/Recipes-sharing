// gggg/db/models/Rating.js
// Rating Schema for rating recipes (1 to 5 stars)

const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
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
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  },
  {
    timestamps: true
  }
);

// Prevent user from rating same recipe twice (Compound Index)
ratingSchema.index({ recipeId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
