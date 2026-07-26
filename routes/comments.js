const router = require("express").Router();
const { Comment, auth } = require("../db");
const { protect } = auth;

// GET / - Get all comments
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("user", "name email profileImage")
      .populate("recipe", "name")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /recipe/:recipeId - Get comments for a specific recipe
router.get("/recipe/:recipeId", async (req, res) => {
  try {
    const comments = await Comment.find({ recipe: req.params.recipeId })
      .populate("user", "name email profileImage")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST / - Add a comment
router.post("/", protect, async (req, res) => {
  try {
    const { recipe, recipeId, text } = req.body;
    const targetRecipe = recipe || recipeId;

    if (!targetRecipe || !text) {
      return res.status(400).json({ success: false, message: "Please provide recipe ID and comment text." });
    }

    const comment = await Comment.create({
      recipe: targetRecipe,
      user: req.user._id,
      text
    });

    await comment.populate("user", "name email profileImage");
    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /:id - Delete comment
router.delete("/:id", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    // Allow author or admin to delete comment
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this comment." });
    }

    await comment.deleteOne();
    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
