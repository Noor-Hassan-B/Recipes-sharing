import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <nav className="nav-links" aria-label="Primary navigation">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/recipes">Recipes</NavLink>
        <NavLink to="/add-recipes">Add Recipes</NavLink>
        <NavLink to="/about-us">About Us</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/signup">Signup</NavLink>
      </nav>

      <Link className="brand" to="/" aria-label="FlavorCraft home">
        FlavorCraft <span aria-hidden="true">*</span>
      </Link>
    </header>
  );
}

export default Navbar;
