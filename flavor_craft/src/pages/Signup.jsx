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
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setIsError(false);

    if (password.length < 8) {
      setIsError(true);
      setMessage("Password must be at least 8 characters long and contain letters and numbers.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await registerUser({ name, email, password });
      if (res && res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(res.user));
        setMessage("🎉 Account successfully registered! Redirecting to recipes...");
        setTimeout(() => navigate("/add-recipes"), 800);
        return;
      } else {
        setIsError(true);
        setMessage("Registration failed. Please check your details.");
      }
    } catch (err) {
      setIsError(true);
      setMessage(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
              Password (Min 8 characters, letters & numbers)
              <input
                type="password"
                placeholder="••••••••"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account ➔"}
            </button>

            {message && (
              <div
                className="auth-message"
                style={{
                  color: isError ? "#e53e3e" : "#2f855a",
                  borderColor: isError ? "#feb2b2" : "#9ae6b4",
                  backgroundColor: isError ? "#fff5f5" : "#f0fff4",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  marginTop: "1rem",
                  fontSize: "0.9rem",
                  textAlign: "center"
                }}
              >
                {message}
              </div>
            )}

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
