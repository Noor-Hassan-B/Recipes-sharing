const router = require("express").Router();
const { auth } = require("../db");
const { protect } = auth;
const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  getUserById
} = require("../backend/controllers/userController");

router.post(["/", "/register"], registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/", getUsers);
router.get("/:id", getUserById);

module.exports = router;
