// routes/categories.js - Protected Category Routes

const router = require("express").Router();
const { auth } = require("../db");
const { protect, adminOnly } = auth;
const { validateObjectIdParam } = require("../backend/middleware/validationMiddleware");
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../backend/controllers/categoryController");

// Public reading routes
router.get("/", getCategories);
router.get("/:id", validateObjectIdParam("id"), getCategoryById);

// Admin-only management routes
router.post("/", protect, adminOnly, createCategory);
router.put("/:id", protect, adminOnly, validateObjectIdParam("id"), updateCategory);
router.delete("/:id", protect, adminOnly, validateObjectIdParam("id"), deleteCategory);

module.exports = router;
