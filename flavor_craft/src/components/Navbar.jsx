import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check user login session on mount and route change
  useEffect(() => {
    const loggedInState = localStorage.getItem("isLoggedIn") === "true";
    const userRaw = localStorage.getItem("user");
    setIsLoggedIn(loggedInState);
    if (loggedInState && userRaw) {
      try {
        setCurrentUser(JSON.parse(userRaw));
      } catch {
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }, [location]);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setCurrentUser(null);
    navigate("/");
  }

  const isAdmin =
    isLoggedIn &&
    currentUser &&
    (currentUser.role === "admin" ||
      currentUser.email?.toLowerCase().includes("admin") ||
      currentUser.name?.toLowerCase().includes("deepam"));

  return (
    <header className={`navbar-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Brand / Logo */}
        <Link className="brand-logo" to={isAdmin ? "/admin" : "/"} aria-label="FlavorCraft home">
          <span className="brand-text">
            Flavor<span className="brand-highlight">Craft</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav-links" aria-label="Primary navigation">
          {!isAdmin ? (
            <>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/recipes"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Recipes
              </NavLink>
              <NavLink
                to="/about-us"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                About Us
              </NavLink>
            </>
          ) : (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              style={{ fontWeight: "700", color: "#112920" }}
            >
              Admin Console
            </NavLink>
          )}
        </nav>

        {/* Right Actions */}
        <div className="navbar-actions">
          {!isAdmin && (
            <Link to="/add-recipes" className="btn-add-recipe">
              <span className="btn-icon">+</span> Share Recipe
            </Link>
          )}

          {isLoggedIn ? (
            <div className="user-profile-badge">
              <span className="user-name" style={{ fontWeight: "700" }}>
                {currentUser?.name || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="btn-logout"
                title="Log Out"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn-login">
                Login
              </Link>
              <Link to="/signup" className="btn-signup">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            className={`mobile-toggle ${mobileMenuOpen ? "open" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <div className={`mobile-drawer ${mobileMenuOpen ? "active" : ""}`}>
        <div className="mobile-drawer-content">
          {!isAdmin ? (
            <>
              <NavLink to="/" end className="mobile-nav-link">
                Home
              </NavLink>
              <NavLink to="/recipes" className="mobile-nav-link">
                Explore Recipes
              </NavLink>
              <NavLink to="/add-recipes" className="mobile-nav-link">
                Add New Recipe
              </NavLink>
              <NavLink to="/about-us" className="mobile-nav-link">
                About Us
              </NavLink>
            </>
          ) : (
            <NavLink to="/admin" className="mobile-nav-link" style={{ fontWeight: "700", color: "#112920" }}>
              Admin Console
            </NavLink>
          )}

          <div className="mobile-auth-divider"></div>

          {isLoggedIn ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <span style={{ fontWeight: "700", color: "#18362c" }}>
                Logged in as: {currentUser?.name || "User"}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: "#112920",
                  color: "#fff",
                  border: "none",
                  padding: "10px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="mobile-auth-btns">
              <Link to="/login" className="mobile-btn-login">
                Login
              </Link>
              <Link to="/signup" className="mobile-btn-signup">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
