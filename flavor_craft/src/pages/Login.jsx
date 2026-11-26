import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import "./Auth.css";

import { loginUser } from "../services/api.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    try {
      const res = await loginUser(email, password);
      if (res && res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(res.user));
        setMessage("✅ Authentication verified. Redirecting...");
        const isUserAdmin = res.user.role === "admin";
        setTimeout(() => navigate(isUserAdmin ? "/admin" : "/add-recipes"), 800);
        return;
      } else {
        setIsError(true);
        setMessage("Invalid response from server. Please try again.");
      }
    } catch (err) {
      setIsError(true);
      setMessage(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Log In ➔"}
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
