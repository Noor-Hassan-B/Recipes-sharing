// backend/controllers/recipeController.js
const { Recipe, Comment, Rating } = require("../../db");

// GET / - Get all recipes with search & category query filtering
const getRecipes = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== "All") {
      query.cuisine = { $regex: new RegExp(category, "i") };
    }

    if (search) {
      query.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { description: { $regex: new RegExp(search, "i") } },
        { ingredients: { $elemMatch: { $regex: new RegExp(search, "i") } } }
      ];
    }

    const recipes = await Recipe.find(query)
      .populate("createdBy", "name email profileImage")
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /:id - Get single recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("createdBy", "name email profileImage");

    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST / - Create a new recipe
const createRecipe = async (req, res) => {
  try {
    const recipeData = {
      ...req.body,
      image: req.body.image || "/uploads/default-recipe.jpg"
    };

    const recipe = await Recipe.create(recipeData);
    res.status(201).json({ success: true, recipe });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST /:id/comments - Add comment to recipe
const addRecipeComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      recipe: req.params.id,
      user: req.user._id,
      text: req.body.text
    });
    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST /:id/ratings - Add rating to recipe
const addRecipeRating = async (req, res) => {
  try {
    const rating = await Rating.create({
      recipe: req.params.id,
      user: req.user._id,
      score: req.body.score
    });
    res.status(201).json({ success: true, rating });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /:id - Update recipe
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    res.json({ success: true, recipe });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /:id - Delete recipe
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    res.json({ success: true, message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  addRecipeComment,
  addRecipeRating,
  updateRecipe,
  deleteRecipe
};
