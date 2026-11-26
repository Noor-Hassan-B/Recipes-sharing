// routes/users.js - Protected User Routes

const router = require("express").Router();
const { auth } = require("../db");
const { protect, adminOnly } = auth;
const {
  validateRegister,
  validateLogin,
  validateObjectIdParam
} = require("../backend/middleware/validationMiddleware");
const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  getUserById
} = require("../backend/controllers/userController");

// Public authentication routes (with validation and rate-limiting)
router.post(["/", "/register"], validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);

// Authenticated current user profile
router.get("/me", protect, getMe);

// Admin-only route to list all platform users (prevents unauthorized database scraping)
router.get("/", protect, adminOnly, getUsers);

// Public author profile lookup (returns public info only)
router.get("/:id", validateObjectIdParam("id"), getUserById);

module.exports = router;
