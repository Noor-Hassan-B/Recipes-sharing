const express = require("express");

const app = express();

app.use(express.json());

app.use("/users", require("./db/routes/users"));
app.use("/recipes", require("./db/routes/recipes"));
app.use("/categories", require("./db/routes/categories"));
app.use("/comments", require("./db/routes/comments"));
app.use("/ratings", require("./db/routes/ratings"));
app.use("/favorites", require("./db/routes/favorites"));

app.get("/", (req, res) => {
    res.send("Recipe API is running...");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
