const router = require("express").Router();
const { users } = require("../data/mockDB");

// GET all users
router.get("/", (req, res) => {
    res.json(users);
});

// LOGIN (must come BEFORE "/:id")
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    res.json({
        success: true,
        message: "Login successful",
        user
    });
});

// GET user by id
router.get("/:id", (req, res) => {
    const user = users.find(u => u.id === req.params.id);

    if (!user)
        return res.status(404).json({ message: "User not found" });

    res.json(user);
});

// POST create user
router.post("/", (req, res) => {
    const user = {
        id: Date.now().toString(),
        profileImage: "/uploads/default-avatar.png",
        role: "user",
        ...req.body
    };

    users.push(user);

    res.status(201).json(user);
});

module.exports = router;
