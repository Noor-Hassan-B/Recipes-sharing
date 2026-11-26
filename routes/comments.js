// routes/comments.js - Protected Comment Routes

const router = require("express").Router();
const { auth } = require("../db");
const { protect } = auth;
const {
  validateComment,
  validateObjectIdParam
} = require("../backend/middleware/validationMiddleware");
const {
  getComments,
  getCommentsByRecipe,
  createComment,
  deleteComment
} = require("../backend/controllers/commentController");

router.get("/", getComments);
router.get("/recipe/:recipeId", validateObjectIdParam("recipeId"), getCommentsByRecipe);
router.post("/", protect, validateComment, createComment);
router.delete("/:id", protect, validateObjectIdParam("id"), deleteComment);

module.exports = router;
