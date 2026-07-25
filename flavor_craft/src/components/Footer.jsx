import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-section" id="connect">
      <div className="footer-container">
        {/* Brand Column */}
        <div className="footer-brand-col">
          <Link to="/" className="footer-logo">
            <span></span> Flavor<span className="logo-accent">Craft</span>
          </Link>
          <p className="footer-motto">
            Discover, cook, and share authentic home recipes with food lovers
            worldwide. Elevate your culinary skills with FlavorCraft.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="footer-links-col">
          <h4>Explore</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/recipes">All Recipes</Link>
            </li>
            <li>
              <Link to="/add-recipes">Share Your Recipe</Link>
            </li>
            <li>
              <Link to="/about-us">About Our Team</Link>
            </li>
          </ul>
        </div>

        {/* Categories Column */}
        <div className="footer-links-col">
          <h4>Popular Cuisines</h4>
          <ul>
            <li>
              <Link to="/recipes?category=Indian">Indian Delights</Link>
            </li>
            <li>
              <Link to="/recipes?category=Italian">Italian Classics</Link>
            </li>
            <li>
              <Link to="/recipes?category=Mexican">Mexican Spice</Link>
            </li>
            <li>
              <Link to="/recipes?category=Asian">Asian Fusion</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="footer-newsletter-col">
          <h4>Stay Inspired</h4>
          <p>
            Subscribe to our weekly recipe newsletter for fresh culinary ideas.
          </p>
          <form
            className="newsletter-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Join</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} FlavorCraft. Built for passionate home
          chefs.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
