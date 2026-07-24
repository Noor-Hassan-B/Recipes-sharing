import { Link } from "react-router-dom";
import Footer from "../../components/member2/Footer.jsx";
import Navbar from "../../components/member2/Navbar.jsx";
import "./Auth.css";

function Login() {
  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <div className="auth-page">
      <Navbar />

      <main className="auth-main">
        <section className="auth-intro">
          <h1>Welcome Back</h1>
          <p>Log in to save recipes, share dishes, and keep cooking.</p>
        </section>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input placeholder="your@email.com" required type="email" />
          </label>

          <label>
            Password
            <input placeholder="Enter your password" required type="password" />
          </label>

          <button type="submit">Login</button>

          <p>
            New to FlavorCraft? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default Login;
