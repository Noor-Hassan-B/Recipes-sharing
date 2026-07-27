import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import "./Auth.css";

import { registerUser } from "../services/api.js";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await registerUser({ name, email, password });
      if (res && res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(res.user));
        setMessage("🎉 Account created & saved to database! Redirecting...");
        setTimeout(() => navigate("/add-recipes"), 800);
        return;
      }
    } catch (err) {
      console.warn("Backend API register fallback to offline mode:", err.message);
    }

    const userObj = {
      name: name || "Chef User",
      email: email,
      role: "user"
    };

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(userObj));
    setMessage("🎉 Account created! Redirecting...");

    setTimeout(() => {
      navigate("/add-recipes");
    }, 800);
  }

  return (
    <div className="auth-page">
      <Navbar />

      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-intro">
            <h1>Create an Account</h1>
            <p>Join thousands of food lovers sharing and discovering recipes every day.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Full Name
              <input
                type="text"
                placeholder="e.g. Ashley Sasha"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

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

            <button type="submit">Create Account ➔</button>

            {message && <div className="auth-message">{message}</div>}

            <p className="auth-footer-text">
              Already have an account? <Link to="/login">Log In</Link>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Signup;
