import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/member2/Footer.jsx";
import Navbar from "../../components/member2/Navbar.jsx";
import "./Auth.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      setMessage("Emails do not match.");
      return;
    }

    setMessage("Account details look good. Backend connection comes next.");
  }

  return (
    <div className="auth-page">
      <Navbar />

      <main className="auth-main">
        <section className="auth-intro">
          <h1>Create Account</h1>
          <p>Join FlavorCraft and start sharing your favorite recipes.</p>
        </section>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Full Name
            <input placeholder="Your name" required type="text" />
          </label>

          <label>
            Email
            <input
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@email.com"
              required
              type="email"
              value={email}
            />
          </label>

          <label>
            Re-enter Email
            <input
              onChange={(event) => setConfirmEmail(event.target.value)}
              placeholder="Confirm your email"
              required
              type="email"
              value={confirmEmail}
            />
          </label>

          <label>
            Password
            <input placeholder="Create a password" required type="password" />
          </label>

          <button type="submit">Signup</button>

          {message && <p className="auth-message">{message}</p>}

          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default Signup;
