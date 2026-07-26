import { useState, useEffect } from "react";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import "./Recipes.css";

const initialRecipes = [
  {
    id: 1,
    name: "Butter Chicken",
    cuisine: "Indian",
    time: "45 min",
    difficulty: "Medium",
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80",
    description:
      "A creamy tomato-based chicken curry infused with rich aromatic spices and garlic butter sauce.",
    ingredients: ["Chicken", "Tomatoes", "Heavy Cream", "Butter", "Garam Masala", "Garlic"],
    steps: [
      "Marinate and sear chicken pieces until golden brown.",
      "Simmer blended tomatoes, butter, and cream into a velvety curry sauce.",
      "Combine chicken with sauce and simmer on low heat for 15 minutes.",
    ],
  },
  {
    id: 2,
    name: "Crispy Masala Dosa",
    cuisine: "Indian",
    time: "35 min",
    difficulty: "Easy",
    image:
      "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80",
    description:
      "A thin golden crisp rice crepe filled with fragrant spiced potatoes and served with coconut chutney.",
    ingredients: ["Fermented Dosa Batter", "Potatoes", "Onions", "Mustard Seeds", "Curry Leaves"],
    steps: [
      "Sauté mustard seeds, curry leaves, and potatoes with turmeric for filling.",
      "Ladle batter on hot griddle, spread into thin circle with ghee.",
      "Place potato filling inside, roll tightly and serve piping hot.",
    ],
  },
  {
    id: 3,
    name: "Sadza and Grilled Fish",
    cuisine: "Zimbabwean",
    time: "30 min",
    difficulty: "Easy",
    image: "/zimbabwe.jpg",
    description:
      "A classic Zimbabwean feast of smooth white sadza, seasoned tilapia, and fresh leafy greens.",
    ingredients: ["White Cornmeal", "Tilapia Fish", "Collard Greens", "Tomatoes", "Onion"],
    steps: [
      "Prepare sadza by stirring cornmeal into boiling water until thick dough forms.",
      "Season tilapia with herbs and grill over medium flames.",
      "Sauté greens with tomatoes and serve alongside warm sadza.",
    ],
  },
  {
    id: 4,
    name: "Peanut Butter Rice",
    cuisine: "Zimbabwean",
    time: "25 min",
    difficulty: "Easy",
    image:
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=700&q=80",
    description:
      "A traditional Zimbabwean staple pairing fluffy white rice with rich natural peanut butter.",
    ingredients: ["Long-grain Rice", "Smooth Peanut Butter", "Salt", "Water"],
    steps: [
      "Boil rice until soft and tender.",
      "Fold in creamy peanut butter until rich and velvety.",
      "Simmer for 5 minutes before serving with stew or relish.",
    ],
  },
  {
    id: 5,
    name: "Classic Margherita Pizza",
    cuisine: "Italian",
    time: "20 min",
    difficulty: "Easy",
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=700&q=80",
    description:
      "Traditional Neapolitan pizza topped with San Marzano tomatoes, fresh mozzarella, and aromatic basil.",
    ingredients: ["Pizza Dough", "Tomato Sauce", "Fresh Mozzarella", "Fresh Basil", "Olive Oil"],
    steps: [
      "Stretch dough onto preheated pizza stone.",
      "Spread tomato sauce and tear fresh mozzarella slices.",
      "Bake at high temperature for 10 minutes and garnish with fresh basil leaves.",
    ],
  },
  {
    id: 6,
    name: "Street Style Tacos",
    cuisine: "Mexican",
    time: "25 min",
    difficulty: "Easy",
    image:
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=700&q=80",
    description:
      "Warm corn tortillas piled high with flame-grilled seasoned meat, chopped cilantro, and salsa verde.",
    ingredients: ["Corn Tortillas", "Flank Steak", "Cilantro", "White Onion", "Lime", "Salsa"],
    steps: [
      "Grill marinated steak strips over high heat and dice finely.",
      "Warm corn tortillas on flat top griddle.",
      "Assemble meat onto double tortillas, top with onion, cilantro, and squeezed lime.",
    ],
  },
];

function Recipes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const [recipesList, setRecipesList] = useState(initialRecipes);

  const categories = ["All", "Indian", "Zimbabwean", "Italian", "Mexican", "French", "Thai"];

  useEffect(() => {
    const saved = localStorage.getItem("flavorcraft_recipes_store");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const active = parsed.filter((r) => !r.status || r.status === "Approved");
        setRecipesList(active.length ? active : initialRecipes);
      } catch {
        setRecipesList(initialRecipes);
      }
    } else {
      setRecipesList(initialRecipes);
    }
  }, []);

  const filteredRecipes = recipesList.filter((recipe) => {
    const nameMatch = recipe.name ? recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const descMatch = recipe.description ? recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const matchesSearch = nameMatch || descMatch;
    const matchesCategory =
      selectedCategory === "All" || recipe.cuisine === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="recipes-page">
      <Navbar />

      <main className="recipes-main">
        <header className="recipes-hero">
          <h1>Explore Recipe Collection</h1>
          <p>
            Browse handpicked recipes contributed by culinary enthusiasts from around the world. Filter by cuisine or search your favorite dishes.
          </p>
        </header>

        {/* Filter Controls */}
        <div className="recipes-controls">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search recipes, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="category-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Recipe Cards */}
        <div className="recipes-grid">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => {
              const isExpanded = expandedRecipeId === recipe.id;
              return (
                <article className="recipe-card-full" key={recipe.id}>
                  <div className="recipe-img-box">
                    <img src={recipe.image} alt={recipe.name} />
                    <span className="recipe-cuisine-badge">{recipe.cuisine}</span>
                  </div>

                  <div className="recipe-card-body">
                    <h2>{recipe.name}</h2>
                    <div className="recipe-meta-pills">
                      <span className="recipe-meta-pill">⏱️ {recipe.time}</span>
                      <span className="recipe-meta-pill">📊 {recipe.difficulty}</span>
                    </div>

                    <p className="recipe-desc">{recipe.description}</p>

                    <button
                      className="recipe-toggle-btn"
                      onClick={() =>
                        setExpandedRecipeId(isExpanded ? null : recipe.id)
                      }
                    >
                      {isExpanded ? "Hide Recipe Details ▲" : "View Ingredients & Steps ▼"}
                    </button>

                    {isExpanded && (
                      <div className="recipe-details-expanded">
                        <h4>Ingredients</h4>
                        <div className="ingredients-list">
                          {(recipe.ingredients || ["Chef's proprietary spice blend", "Fresh seasonal vegetables & proteins"]).map((ing, i) => (
                            <span className="ingredient-tag" key={i}>
                              {ing}
                            </span>
                          ))}
                        </div>

                        <h4>Step-by-Step Instructions</h4>
                        <ol className="steps-list">
                          {(recipe.steps || ["Prepare ingredients and sanitize workspace.", "Follow classical cooking instructions and garnish before serving."]).map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
              <h3>No recipes found matching "{searchQuery}"</h3>
              <p>Try searching for a different keyword or selecting "All" categories.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Recipes;
