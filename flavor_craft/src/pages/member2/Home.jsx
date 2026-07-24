import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/member2/Footer.jsx";
import Navbar from "../../components/member2/Navbar.jsx";
import "./Home.css";

const featuredRecipes = [
  {
    title: "Indian Butter Chicken",
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Zimbabwean Sadza and Grilled Fish",
    image: "/zimbabwe.jpg",
  },
  {
    title: "Indian Masala Dosa",
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
      setNewsletterMessage("You are signed up for weekly recipe emails.");
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
            <h1>Discover, Cook, Share Recipes for Every Taste</h1>
            <p>
              Join a global community of food lovers to discover new recipes,
              improve your skills, and share favorite dishes.
            </p>

            <div className="hero-actions">
              <Link className="secondary-button" to="/recipes">
                View Recipes <span aria-hidden="true">-&gt;</span>
              </Link>
              <Link className="primary-button" to="/add-recipes">
                Share Recipe <span aria-hidden="true">*</span>
              </Link>
            </div>
          </div>

          <div className="recipe-gallery" aria-label="Featured recipe images">
            {featuredRecipes.map((recipe, index) => (
              <article className="recipe-card" key={recipe.title}>
                <img src={recipe.image} alt={recipe.title} />
                <div className="recipe-label">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{recipe.title}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="newsletter-section">
          <div className="newsletter-content">
            <h2>Get Weekly Popular Recipes</h2>
            <p>
              Sign up to receive a weekly email with the top recipes from the
              FlavorCraft community.
            </p>

            <form
              action="https://formsubmit.co/ashleysasha839@gmail.com"
              className="newsletter-form"
              method="POST"
              onSubmit={handleNewsletterSubmit}
            >
              <input type="hidden" name="_captcha" value="false" />
              <input
                type="hidden"
                name="_subject"
                value="New FlavorCraft Weekly Recipes Signup"
              />

              <label>
                Email Address
                <input
                  name="email"
                  placeholder="your@email.com"
                  required
                  type="email"
                />
              </label>

              <button disabled={isSubscribing} type="submit">
                {isSubscribing ? "Signing Up..." : "Sign Up"}
              </button>

              {newsletterMessage && (
                <p className="newsletter-message">{newsletterMessage}</p>
              )}
            </form>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;

