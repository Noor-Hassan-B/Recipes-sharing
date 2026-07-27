const router = require("express").Router();
const { auth } = require("../db");
const { protect } = auth;
const {
  getComments,
  getCommentsByRecipe,
  createComment,
  deleteComment
} = require("../backend/controllers/commentController");

router.get("/", getComments);
router.get("/recipe/:recipeId", getCommentsByRecipe);
router.post("/", protect, createComment);
router.delete("/:id", protect, deleteComment);

module.exports = router;
