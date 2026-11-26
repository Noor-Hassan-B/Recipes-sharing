// backend/controllers/categoryController.js
// Secure Category Controller with Role-Based Access Control

const { Category } = require("../../db");
const validator = require("validator");

// GET / - Get all categories (Public)
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /:id - Get category by ID (Public)
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST / - Create a category (Admin Only)
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 50) {
      return res.status(400).json({
        success: false,
        message: "Category name must be between 2 and 50 characters."
      });
    }

    const cleanName = validator.escape(name.trim());
    const existing = await Category.findOne({ name: cleanName });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A category with this name already exists."
      });
    }

    const category = await Category.create({ name: cleanName });
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /:id - Update category (Admin Only)
const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 50) {
      return res.status(400).json({
        success: false,
        message: "Category name must be between 2 and 50 characters."
      });
    }

    const cleanName = validator.escape(name.trim());
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: cleanName },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /:id - Delete category (Admin Only)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
