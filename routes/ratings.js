const router = require("express").Router();
const { ratings } = require("../data/mockDB");

// Get all ratings
router.get("/", (req, res) => {
    res.json(ratings);
});

// Get ratings for a recipe
router.get("/recipe/:recipeId", (req, res) => {

    const recipeRatings = ratings.filter(
        r => r.recipeId === req.params.recipeId
    );

    res.json(recipeRatings);
});

// Add rating
router.post("/", (req, res) => {

    const rating = {
        id: Date.now().toString(),
        ...req.body
    };

    ratings.push(rating);

    res.status(201).json(rating);
});

// Delete rating
router.delete("/:id", (req, res) => {

    const index = ratings.findIndex(r => r.id === req.params.id);

    if (index === -1)
        return res.status(404).json({ message: "Rating not found" });

    ratings.splice(index, 1);

    res.json({ message: "Rating deleted successfully" });

});

module.exports = router;
