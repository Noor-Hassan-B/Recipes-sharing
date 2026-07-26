const router = require("express").Router();
const { comments } = require("../data/mockDB");

// Get all comments
router.get("/", (req, res) => {
    res.json(comments);
});

// Get comments for a recipe
router.get("/recipe/:recipeId", (req, res) => {

    const recipeComments = comments.filter(
        c => c.recipeId === req.params.recipeId
    );

    res.json(recipeComments);
});

// Add comment
router.post("/", (req, res) => {

    const comment = {
        id: Date.now().toString(),
        createdAt: new Date(),
        ...req.body
    };

    comments.push(comment);

    res.status(201).json(comment);
});

// Delete comment
router.delete("/:id", (req, res) => {

    const index = comments.findIndex(c => c.id === req.params.id);

    if (index === -1)
        return res.status(404).json({ message: "Comment not found" });

    comments.splice(index, 1);

    res.json({ message: "Comment deleted successfully" });

});

module.exports = router;
