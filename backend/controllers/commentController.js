// backend/controllers/commentController.js
const { Comment } = require("../../db");

// GET / - Get all comments
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("userId", "name email profileImage")
      .populate("recipeId", "title")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /recipe/:recipeId - Get comments for a specific recipe
const getCommentsByRecipe = async (req, res) => {
  try {
    const comments = await Comment.find({ recipeId: req.params.recipeId })
      .populate("userId", "name email profileImage")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST / - Add a comment
const createComment = async (req, res) => {
  try {
    const { recipe, recipeId, text } = req.body;
    const targetRecipe = recipe || recipeId;

    if (!targetRecipe || !text) {
      return res.status(400).json({ success: false, message: "Please provide recipe ID and comment text." });
    }

    const comment = await Comment.create({
      recipeId: targetRecipe,
      userId: req.user._id,
      comment: text
    });

    await comment.populate("userId", "name email profileImage");
    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /:id - Delete comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    // Allow author or admin to delete comment
    if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this comment." });
    }

    await comment.deleteOne();
    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getComments, getCommentsByRecipe, createComment, deleteComment };
