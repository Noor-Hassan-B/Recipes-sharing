// backend/controllers/recipeController.js
// Secure Recipe Controller with BOLA/IDOR protection and ReDoS prevention

const { Recipe, Comment, Rating } = require("../../db");
const { escapeRegex } = require("../middleware/validationMiddleware");

// GET / - Get all recipes with safe search & category query filtering (ReDoS protected)
const getRecipes = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== "All" && typeof category === "string") {
      const safeCategory = escapeRegex(category.trim());
      query.category = { $regex: new RegExp(`^${safeCategory}$`, "i") };
    }

    if (search && typeof search === "string" && search.trim() !== "") {
      const safeSearch = escapeRegex(search.trim());
      query.$or = [
        { title: { $regex: new RegExp(safeSearch, "i") } },
        { description: { $regex: new RegExp(safeSearch, "i") } },
        { ingredients: { $elemMatch: { $regex: new RegExp(safeSearch, "i") } } }
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

// POST / - Create a new recipe (Strictly authenticated; mass-assignment protected)
const createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      instructions,
      category,
      difficulty,
      preparationTime,
      image
    } = req.body;

    // Sanitize image URL (only allow relative /uploads paths or trusted https domains)
    let safeImage = "/uploads/default-recipe.jpg";
    if (typeof image === "string" && image.trim()) {
      const trimmed = image.trim();
      if (trimmed.startsWith("/uploads/") || trimmed.startsWith("https://")) {
        safeImage = trimmed;
      }
    }

    // Process ingredients list safely
    let formattedIngredients = [];
    if (Array.isArray(ingredients)) {
      formattedIngredients = ingredients.map((i) => String(i).trim()).filter(Boolean);
    } else if (typeof ingredients === "string") {
      formattedIngredients = ingredients.split(",").map((i) => i.trim()).filter(Boolean);
    }

    const recipe = await Recipe.create({
      title: title.trim(),
      description: description.trim(),
      ingredients: formattedIngredients,
      instructions: instructions.trim(),
      category: category ? category.trim() : "General",
      difficulty: difficulty || "Easy",
      preparationTime: Number(preparationTime) || 30,
      image: safeImage,
      createdBy: req.user._id // Bound strictly to authenticated user session
    });

    await recipe.populate("createdBy", "name email profileImage");

    res.status(201).json({ success: true, recipe });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST /:id/comments - Add comment to recipe (Strictly authenticated)
const addRecipeComment = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    const comment = await Comment.create({
      recipeId: req.params.id,
      userId: req.user._id,
      comment: req.body.text
    });

    await comment.populate("userId", "name email profileImage");
    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST /:id/ratings - Add rating to recipe (Strictly authenticated)
const addRecipeRating = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    const score = Number(req.body.score);
    if (isNaN(score) || score < 1 || score > 5) {
      return res.status(400).json({ success: false, message: "Rating must be an integer between 1 and 5." });
    }

    const rating = await Rating.findOneAndUpdate(
      { recipeId: req.params.id, userId: req.user._id },
      { rating: score },
      { new: true, upsert: true, runValidators: true }
    );

    // Recalculate average rating for the recipe
    const allRatings = await Rating.find({ recipeId: req.params.id });
    const avg = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
    recipe.averageRating = Math.round(avg * 10) / 10;
    await recipe.save();

    res.status(201).json({ success: true, rating, averageRating: recipe.averageRating });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /:id - Update recipe (Strict BOLA / IDOR Verification)
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    // BOLA Check: Caller must be the author or a platform admin
    const isAuthor = recipe.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access Denied: You do not have permission to edit this recipe."
      });
    }

    // Whitelist fields to prevent mass assignment vulnerability
    const allowedUpdates = [
      "title",
      "description",
      "ingredients",
      "instructions",
      "category",
      "difficulty",
      "preparationTime",
      "image"
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        recipe[field] = req.body[field];
      }
    });

    const updatedRecipe = await recipe.save();
    await updatedRecipe.populate("createdBy", "name email profileImage");

    res.json({ success: true, recipe: updatedRecipe });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /:id - Delete recipe (Strict BOLA / IDOR Verification)
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    // BOLA Check: Caller must be the author or a platform admin
    const isAuthor = recipe.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access Denied: You do not have permission to delete this recipe."
      });
    }

    await recipe.deleteOne();

    // Clean up associated comments and ratings
    await Comment.deleteMany({ recipeId: req.params.id });
    await Rating.deleteMany({ recipeId: req.params.id });

    res.json({ success: true, message: "Recipe and associated data deleted successfully" });
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
