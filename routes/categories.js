const router = require("express").Router();
const { categories } = require("../data/mockDB");

// Get all categories
router.get("/", (req, res) => {
  res.json(categories);
});

// Get category
router.get("/:id", (req, res) => {
  const category = categories.find(c => c.id === req.params.id);

  if (!category)
    return res.status(404).json({ message: "Category not found" });

  res.json(category);
});

// Create category
router.post("/", (req, res) => {

  const category = {
    id: Date.now().toString(),
    ...req.body
  };

  categories.push(category);

  res.status(201).json(category);
});

// Update category
router.put("/:id", (req, res) => {

  const category = categories.find(c => c.id === req.params.id);

  if (!category)
    return res.status(404).json({ message: "Category not found" });

  Object.assign(category, req.body);

  res.json(category);
});

// Delete category
router.delete("/:id", (req, res) => {

  const index = categories.findIndex(c => c.id === req.params.id);

  if (index === -1)
    return res.status(404).json({ message: "Category not found" });

  categories.splice(index, 1);

  res.json({ message: "Category deleted successfully" });

});

module.exports = router;
