import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    const isUserAdmin = email.toLowerCase().includes("admin") || email.toLowerCase().includes("deepam");
    const derivedName = email.split("@")[0].replace(/[._]/g, " ");
    const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

    const userObj = {
      name: isUserAdmin ? `${formattedName || "Admin"} (Master Admin)` : (formattedName || "Chef User"),
      email: email,
      role: isUserAdmin ? "admin" : "chef",
    };

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(userObj));

    setMessage("Authentication verified. Redirecting to system workspace...");

    setTimeout(() => {
      navigate(isUserAdmin ? "/admin" : "/add-recipes");
    }, 800);
  }

  return (
    <div className="auth-page">
      <Navbar />

      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-intro">
            <h1>Welcome Back</h1>
            <p>Log in to share recipes, access saved collections, and manage your profile.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email Address
              <input
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label>
              Password
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button type="submit">Log In ➔</button>

            {message && <div className="auth-message">{message}</div>}

            <p className="auth-footer-text">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Login;
