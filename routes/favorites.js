const router = require("express").Router();
const { favorites } = require("../data/mockDB");

// Get all favorites
router.get("/", (req, res) => {
    res.json(favorites);
});

// Get favorites for a user
router.get("/user/:userId", (req, res) => {

    const userFavorites = favorites.filter(
        f => f.userId === req.params.userId
    );

    res.json(userFavorites);
});

// Add favorite
router.post("/", (req, res) => {

    const favorite = {
        id: Date.now().toString(),
        ...req.body
    };

    favorites.push(favorite);

    res.status(201).json(favorite);
});

// Remove favorite
router.delete("/:id", (req, res) => {

    const index = favorites.findIndex(f => f.id === req.params.id);

    if (index === -1)
        return res.status(404).json({ message: "Favorite not found" });

    favorites.splice(index, 1);

    res.json({ message: "Favorite removed successfully" });

});

module.exports = router;
