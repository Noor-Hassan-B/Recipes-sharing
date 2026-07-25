import { useState } from "react";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import "./AboutUs.css";

const team = [
  { name: "Noor", icon: "/icons/Noor-icon.png" },
  {
    name: "Deepam",
    icon: "/icons/Deepam-icon.png",
  },
  { name: "Ritu", icon: "/icons/Ritu-icon.png" },
  { name: "Vivek", icon: "/icons/Vivek-icon.png" },
  { name: "Ashley", icon: "/icons/Ashley-icon.png" },
];

function AboutUs() {
  const [contactMessage, setContactMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleContactSubmit(event) {
    event.preventDefault();
    setIsSending(true);
    setContactMessage("");

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
        throw new Error("Contact message failed to send");
      }

      form.reset();
      setContactMessage("Thank you! Your message has been sent to the team.");
    } catch {
      setContactMessage("Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="about-page">
      <Navbar />

      <main className="about-main">
        <header className="about-hero">
          <h1>About FlavorCraft</h1>
          <p>
            We are dedicated to bringing home cooks together to explore,
            recreate, and celebrate diverse culinary traditions across the
            globe.
          </p>
        </header>

        <section className="about-grid">
          <div className="about-card">
            <h2>Our Mission</h2>
            <p>
              Food brings people together across cultures and continents.
              FlavorCraft was built to empower everyone — from beginners to
              seasoned home chefs — to share authentic recipes, master classic
              dishes, and pass down cooking heritage.
            </p>
          </div>

          <div className="about-card">
            <h2>Our Vision</h2>
            <p>
              We envision an inclusive global recipe hub where culinary
              enthusiast can discover step-by-step instructions, save their
              favorite recipes, and connect with a community that shares their
              passion for food.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: "60px" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "28px",
              marginBottom: "24px",
            }}
          >
            Meet the Development Team
          </h2>
          <div className="team-grid">
            {team.map((member) => (
              <div className="team-member-card" key={member.name}>
                <div className="team-avatar">
                  <img
                    src={member.icon}
                    alt={`${member.name} icon`}
                    className="team-icon"
                  />
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        <blockquote className="quote-banner">
          "Good food is the foundation of genuine happiness. Cook with passion,
          share with joy."
        </blockquote>

        <section style={{ marginTop: "60px" }}>
          <div
            className="about-card"
            style={{ maxWidth: "640px", margin: "0 auto" }}
          >
            <h2 style={{ textAlign: "center" }}>Get in Touch with Us</h2>
            <form
              action="https://formsubmit.co/sibandagerald839@gmail.com"
              method="POST"
              onSubmit={handleContactSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                marginTop: "20px",
              }}
            >
              <input type="hidden" name="_captcha" value="false" />
              <input
                type="hidden"
                name="_subject"
                value="New FlavorCraft Contact Inquiry"
              />

              <input
                name="name"
                placeholder="Your Name"
                required
                type="text"
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                }}
              />

              <input
                name="email"
                placeholder="Your Email Address"
                required
                type="email"
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                }}
              />

              <textarea
                name="message"
                placeholder="Your Message..."
                required
                rows={4}
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                }}
              />

              <button
                disabled={isSending}
                type="submit"
                style={{
                  background: "var(--color-forest)",
                  color: "#fff",
                  padding: "12px",
                  borderRadius: "24px",
                  border: "none",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                {isSending ? "Sending..." : "Send Message ➔"}
              </button>

              {contactMessage && (
                <p
                  style={{
                    color: "var(--color-coral)",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  {contactMessage}
                </p>
              )}
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AboutUs;
