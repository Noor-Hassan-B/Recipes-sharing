import { useState } from "react";
import Footer from "../../components/member2/Footer.jsx";
import Navbar from "../../components/member2/Navbar.jsx";
import "./AboutUs.css";

const teamMembers = ["Noor", "Deepam", "Ritu", "Vivek", "Ashley"];

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
        throw new Error("Form submission failed");
      }

      form.reset();
      setContactMessage("Message sent successfully.");
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
        <section className="about-content">
          <p className="section-label">About Us</p>
          <h1>FlavorCraft</h1>

          <p>
            FlavorCraft is a simple web application where food lovers can
            discover, share, and explore delicious recipes from around the
            world. Whether you are preparing a quick meal or trying something
            new, FlavorCraft makes finding and sharing recipes easy.
          </p>

          <p>
            <strong>This project was developed by</strong>{" "}
            <strong>Team The Phoenix</strong>{" "}
            <strong>
              as part of our MERN Stack Summer Training group project LPU.
            </strong>
          </p>

          <div className="team-section">
            <h2>Team Members</h2>
            <ul>
              {teamMembers.map((member) => (
                <li key={member}>{member}</li>
              ))}
            </ul>
          </div>

          <blockquote>
            Every recipe tells a story, every dish creates a memory. FlavorCraft
            is where flavors, cultures, and creativity come together, one recipe
            at a time.
          </blockquote>

          <section className="contact-section">
            <div>
              <h2>Contact Us</h2>
              <p>
                Have a question, idea, or recipe suggestion? Send us a message
                and we will get back to you.
              </p>
            </div>

            <form
              action="https://formsubmit.co/ashleysasha839@gmail.com"
              className="contact-form"
              method="POST"
              onSubmit={handleContactSubmit}
            >
              <input type="hidden" name="_captcha" value="false" />
              <input
                type="hidden"
                name="_subject"
                value="New FlavorCraft Contact Message"
              />

              <label>
                Name
                <input name="name" placeholder="Your name" required type="text" />
              </label>

              <label>
                Email
                <input
                  name="email"
                  placeholder="your@email.com"
                  required
                  type="email"
                />
              </label>

              <label>
                Message
                <textarea
                  name="message"
                  placeholder="Write your message"
                  required
                  rows="5"
                />
              </label>

              <button disabled={isSending} type="submit">
                {isSending ? "Sending..." : "Send Message"}
              </button>

              {contactMessage && (
                <p className="contact-message">{contactMessage}</p>
              )}
            </form>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AboutUs;
