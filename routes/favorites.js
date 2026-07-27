const router = require("express").Router();
const { auth } = require("../db");
const { protect } = auth;
const {
  getFavorites,
  getFavoritesByUser,
  addFavorite,
  removeFavorite
} = require("../backend/controllers/favoriteController");

router.get("/", getFavorites);
router.get("/user/:userId", getFavoritesByUser);
router.post("/", protect, addFavorite);
router.delete("/:id", protect, removeFavorite);

module.exports = router;
