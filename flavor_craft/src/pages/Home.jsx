import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import "./Home.css";

const featuredRecipes = [
  {
    title: "Indian Butter Chicken",
    cuisine: "Indian",
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Zimbabwean Sadza and Grilled Fish",
    cuisine: "African",
    image: "/zimbabwe.jpg",
  },
  {
    title: "Crispy Masala Dosa",
    cuisine: "South Indian",
    image:
      "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80",
  },
];

function Home() {
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  async function handleNewsletterSubmit(event) {
    event.preventDefault();
    setIsSubscribing(true);
    setNewsletterMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Newsletter signup failed");
      }

      form.reset();
      setNewsletterMessage("🎉 You are signed up for weekly recipe emails!");
    } catch {
      setNewsletterMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  }

  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="hero" id="discover">
          <img
            alt=""
            aria-hidden="true"
            className="hero-illustration hero-illustration-left"
            src="/female-chef.svg"
          />

          <img
            alt=""
            aria-hidden="true"
            className="hero-illustration hero-illustration-right"
            src="/sushi-cook.svg"
          />

          <div className="hero-content">
            <h1>
              Discover, Cook & Share{" "}
              <span className="text-highlight">Recipes</span> for Every Taste
            </h1>
            <p>
              Join a global community of food lovers to discover new recipes,
              master authentic techniques, and share your culinary creations.
            </p>

            <div className="hero-actions">
              <Link className="hero-btn-primary" to="/recipes">
                Explore Recipes ➔
              </Link>
              <Link className="hero-btn-secondary" to="/add-recipes">
                + Share Your Recipe
              </Link>
            </div>
          </div>

          <div className="recipe-gallery" aria-label="Featured recipe gallery">
            {featuredRecipes.map((recipe, index) => (
              <article className="recipe-card" key={recipe.title}>
                <div className="recipe-card-img-wrapper">
                  <img src={recipe.image} alt={recipe.title} />
                  <span className="recipe-card-badge">
                    #{index + 1} Featured
                  </span>
                </div>
                <div className="recipe-label">
                  <h3>{recipe.title}</h3>
                  <p
                    style={{
                      margin: 0,
                      color: "var(--color-text-muted)",
                      fontSize: "14px",
                    }}
                  >
                    {recipe.cuisine} • Community Choice
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-newsletter">
          <h2>Get Weekly Popular Recipes</h2>
          <p>
            Join 10,000+ food enthusiasts receiving top hand-picked recipes from
            the FlavorCraft community.
          </p>

          <form
            action="https://formsubmit.co/sibandagerald839@gmail.com"
            className="home-newsletter-form"
            method="POST"
            onSubmit={handleNewsletterSubmit}
          >
            <input type="hidden" name="_captcha" value="false" />
            <input
              type="hidden"
              name="_subject"
              value="New FlavorCraft Weekly Recipes Signup"
            />

            <input
              name="email"
              placeholder="Enter your email address"
              required
              type="email"
            />

            <button disabled={isSubscribing} type="submit">
              {isSubscribing ? "Subscribing..." : "Subscribe Now"}
            </button>
          </form>
          {newsletterMessage && (
            <p
              style={{ marginTop: "14px", color: "#f7b94e", fontWeight: "600" }}
            >
              {newsletterMessage}
            </p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
