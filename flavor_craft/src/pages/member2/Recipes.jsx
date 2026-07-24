import { useState } from "react";
import Footer from "../../components/member2/Footer.jsx";
import Navbar from "../../components/member2/Navbar.jsx";
import "./Recipes.css";

const recipes = [
  {
    name: "Butter Chicken",
    cuisine: "Indian",
    time: "45 min",
    difficulty: "Medium",
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80",
    description:
      "A creamy tomato-based chicken curry with warm spices and a rich sauce.",
    ingredients: ["Chicken", "Tomatoes", "Cream", "Butter", "Garam masala"],
    steps: [
      "Cook chicken with spices until lightly browned.",
      "Simmer tomatoes, butter, and cream into a smooth sauce.",
      "Add chicken back into the sauce and cook until tender.",
    ],
  },
  {
    name: "Masala Dosa",
    cuisine: "Indian",
    time: "35 min",
    difficulty: "Easy",
    image:
      "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80",
    description:
      "A crisp rice crepe filled with spiced potatoes and served with chutney.",
    ingredients: ["Dosa batter", "Potatoes", "Onion", "Mustard seeds", "Turmeric"],
    steps: [
      "Prepare the spiced potato filling.",
      "Spread dosa batter thinly on a hot pan.",
      "Add filling, fold, and serve warm.",
    ],
  },
  {
    name: "Sadza and Grilled Fish",
    cuisine: "Zimbabwean",
    time: "30 min",
    difficulty: "Easy",
    image: "/zimbabwe.jpg",
    description:
      "A comforting Zimbabwean plate with sadza, greens, and grilled fish.",
    ingredients: ["Mealie meal", "Fish", "Leafy greens", "Tomatoes", "Onion"],
    steps: [
      "Cook sadza until thick and smooth.",
      "Season and grill the fish until cooked through.",
      "Serve with greens and tomato relish.",
    ],
  },
  {
    name: "Peanut Butter Rice",
    cuisine: "Zimbabwean",
    time: "25 min",
    difficulty: "Easy",
    image:
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=700&q=80",
    description:
      "Soft rice mixed with peanut butter for a simple, filling, and flavorful dish.",
    ingredients: ["Rice", "Peanut butter", "Salt", "Water"],
    steps: [
      "Cook rice until soft.",
      "Stir in peanut butter while the rice is hot.",
      "Season lightly and serve warm.",
    ],
  },
  {
    name: "Chicken Biryani",
    cuisine: "Indian",
    time: "1 hr",
    difficulty: "Medium",
    image:
      "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=700&q=80",
    description:
      "Layered rice and chicken cooked with spices for a fragrant one-pot meal.",
    ingredients: ["Chicken", "Basmati rice", "Yogurt", "Biryani spices", "Onions"],
    steps: [
      "Marinate chicken with yogurt and spices.",
      "Partly cook the rice.",
      "Layer chicken and rice, then steam until finished.",
    ],
  },
  {
    name: "Muboora with Sadza",
    cuisine: "Zimbabwean",
    time: "35 min",
    difficulty: "Easy",
    image:
      "https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?auto=format&fit=crop&w=700&q=80",
    description:
      "Pumpkin leaves cooked into a hearty vegetable side and served with sadza.",
    ingredients: ["Pumpkin leaves", "Tomatoes", "Onion", "Peanut butter", "Sadza"],
    steps: [
      "Wash and chop the pumpkin leaves.",
      "Cook with tomato and onion until tender.",
      "Stir in peanut butter and serve with sadza.",
    ],
  },
];

function Recipes() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  function closeModal() {
    setSelectedRecipe(null);
  }

  return (
    <div className="recipes-page">
      <Navbar />

      <main className="recipes-main">
        <section className="recipes-hero">
          <h1>Explore Recipes From Our Community</h1>
        </section>

        <section className="recipes-grid" aria-label="Recipe list">
          {recipes.map((recipe) => (
            <button
              className="recipe-list-card"
              key={recipe.name}
              onClick={() => setSelectedRecipe(recipe)}
              type="button"
            >
              <img src={recipe.image} alt={recipe.name} />

              <div className="recipe-list-content">
                <div className="recipe-meta">
                  <span>{recipe.time}</span>
                  <span>{recipe.difficulty}</span>
                </div>

                <h2>{recipe.name}</h2>
                <p>{recipe.description}</p>
              </div>
            </button>
          ))}
        </section>
      </main>

      {selectedRecipe && (
        <div className="recipe-modal-backdrop" onClick={closeModal}>
          <section
            aria-labelledby="recipe-modal-title"
            aria-modal="true"
            className="recipe-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <button
              aria-label="Close recipe details"
              className="modal-close-button"
              onClick={closeModal}
              type="button"
            >
              x
            </button>

            <img src={selectedRecipe.image} alt={selectedRecipe.name} />

            <div className="recipe-modal-content">
              <div className="recipe-meta">
                <span>{selectedRecipe.cuisine}</span>
                <span>{selectedRecipe.time}</span>
                <span>{selectedRecipe.difficulty}</span>
              </div>

              <h2 id="recipe-modal-title">{selectedRecipe.name}</h2>
              <p>{selectedRecipe.description}</p>

              <div className="recipe-detail-columns">
                <div>
                  <h3>Ingredients</h3>
                  <ul>
                    {selectedRecipe.ingredients.map((ingredient) => (
                      <li key={ingredient}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3>Steps</h3>
                  <ol>
                    {selectedRecipe.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Recipes;
