// routes/favorites.js - Protected Favorite Routes

const router = require("express").Router();
const { auth } = require("../db");
const { protect, adminOnly } = auth;
const { validateObjectIdParam } = require("../backend/middleware/validationMiddleware");
const {
  getFavorites,
  getFavoritesByUser,
  addFavorite,
  removeFavorite
} = require("../backend/controllers/favoriteController");

router.get("/", protect, adminOnly, getFavorites);
router.get("/user/:userId", protect, validateObjectIdParam("userId"), getFavoritesByUser);
router.post("/", protect, addFavorite);
router.delete("/:id", protect, validateObjectIdParam("id"), removeFavorite);

module.exports = router;
