const router = require("express").Router();
const { recipes } = require("../data/mockDB");

// Get all recipes
router.get("/", (req, res) => {
    res.json(recipes);
});

// Get recipe by ID
router.get("/:id", (req, res) => {

    const recipe = recipes.find(r => r.id === req.params.id);

    if (!recipe)
        return res.status(404).json({ message: "Recipe not found" });

    res.json(recipe);
});

// Create recipe
router.post("/", (req, res) => {

    const recipe = {
        id: Date.now().toString(),
        image: "/uploads/default-recipe.jpg",
        averageRating: 0,
        likes: 0,
        ...req.body
    };

    recipes.push(recipe);

    res.status(201).json(recipe);
});

// Update recipe
router.put("/:id", (req, res) => {

    const recipe = recipes.find(r => r.id === req.params.id);

    if (!recipe)
        return res.status(404).json({ message: "Recipe not found" });

    Object.assign(recipe, req.body);

    res.json(recipe);
});

// Delete recipe
router.delete("/:id", (req, res) => {

    const index = recipes.findIndex(r => r.id === req.params.id);

    if (index === -1)
        return res.status(404).json({ message: "Recipe not found" });

    recipes.splice(index, 1);

    res.json({ message: "Recipe deleted successfully" });

});

module.exports = router;
