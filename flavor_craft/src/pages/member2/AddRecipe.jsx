import { useState } from "react";
import Footer from "../../components/member2/Footer.jsx";
import Navbar from "../../components/member2/Navbar.jsx";
import "./AddRecipe.css";

const initialForm = {
  name: "",
  cuisine: "",
  time: "",
  difficulty: "Easy",
  imageUrl: "",
  ingredients: "",
  instructions: "",
};

function AddRecipe() {
  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("Recipe saved locally for now. Backend connection comes next.");
    setFormData(initialForm);
  }

  return (
    <div className="add-recipe-page">
      <Navbar />

      <main className="add-recipe-main">
        <section className="add-recipe-intro">
          <h1>Add Your Favorite Dish</h1>
          <p>
            Provide Recipe details in a clear easy way to understand and follow.
            List the instructions in numbered sequence.
          </p>
        </section>

        <form className="recipe-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              Recipe Name
              <input
                name="name"
                onChange={handleChange}
                placeholder="Example: Masala Dosa"
                required
                type="text"
                value={formData.name}
              />
            </label>

            <label>
              Cuisine
              <input
                name="cuisine"
                onChange={handleChange}
                placeholder="Example: Indian"
                required
                type="text"
                value={formData.cuisine}
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Prep/Cook Time
              <input
                name="time"
                onChange={handleChange}
                placeholder="Example: 35 min"
                required
                type="text"
                value={formData.time}
              />
            </label>

            <label>
              Difficulty
              <select
                name="difficulty"
                onChange={handleChange}
                value={formData.difficulty}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </label>
          </div>

          <label>
            Image URL
            <input
              name="imageUrl"
              onChange={handleChange}
              placeholder="Paste an image link"
              type="url"
              value={formData.imageUrl}
            />
          </label>

          <label>
            Ingredients
            <textarea
              name="ingredients"
              onChange={handleChange}
              placeholder="List ingredients, separated by commas or new lines"
              required
              rows="5"
              value={formData.ingredients}
            />
          </label>

          <label>
            Instructions
            <textarea
              name="instructions"
              onChange={handleChange}
              placeholder="Write the cooking steps"
              required
              rows="6"
              value={formData.instructions}
            />
          </label>

          <button className="submit-recipe-button" type="submit">
            Add Recipe
          </button>

          {message && <p className="form-message">{message}</p>}
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default AddRecipe;
