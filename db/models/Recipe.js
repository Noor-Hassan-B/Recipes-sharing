// gggg/db/models/Recipe.js
// Recipe Schema for managing recipe posts

const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter a recipe title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please enter a short description']
    },
    ingredients: {
      type: [String],
      required: [true, 'Please list the ingredients']
    },
    instructions: {
      type: String,
      required: [true, 'Please provide cooking instructions']
    },
    image: {
      type: String,
      default: '/uploads/default-recipe.jpg'
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      default: 'General'
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy'
    },
    preparationTime: {
      type: Number,
      required: [true, 'Please enter prep time in minutes']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    averageRating: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Recipe', recipeSchema);
