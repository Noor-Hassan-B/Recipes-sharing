import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import "./AddRecipe.css";

const cuisineOptions = [
  "Indian",
  "Italian",
  "Mexican",
  "Zimbabwean / African",
  "Chinese",
  "Japanese",
  "Thai",
  "French",
  "Mediterranean",
  "American",
  "Spanish",
  "Middle Eastern",
  "Vietnamese",
  "Korean",
  "Other",
];

function AddRecipe() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    cuisine: "Indian",
    time: "",
    difficulty: "Easy",
    publisherName: "",
    publisherContact: "",
    ingredients: "",
    instructions: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [message, setMessage] = useState("");

  // Check login status on component mount
  useEffect(() => {
    const loggedInState = localStorage.getItem("isLoggedIn") === "true";
    const userRaw = localStorage.getItem("user");
    setIsLoggedIn(loggedInState);

    if (loggedInState && userRaw) {
      try {
        const parsedUser = JSON.parse(userRaw);
        setCurrentUser(parsedUser);
        setFormData((prev) => ({
          ...prev,
          publisherName: parsedUser.name || "",
          publisherContact: parsedUser.email || "",
        }));
      } catch {
        // fallback
      }
    }
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreviewUrl(objectUrl);
    }
  }

  function handleRemoveImage() {
    setSelectedFile(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!selectedFile) {
      setMessage("Please upload a recipe image file before submitting.");
      return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem("flavorcraft_recipes_store") || "[]");
      const newRecipeEntry = {
        id: "r_" + Date.now(),
        name: formData.name,
        cuisine: formData.cuisine || "Indian",
        time: formData.time || "30 min",
        difficulty: formData.difficulty || "Easy",
        publisherName: formData.publisherName || currentUser?.name || "Community Chef",
        publisherContact: formData.publisherContact,
        status: "Pending",
        featured: false,
        rating: 5.0,
        reviewsCount: 1,
        image: imagePreviewUrl || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80",
        description: formData.instructions || "Authentic home recipe contributed to FlavorCraft community.",
        ingredients: formData.ingredients ? formData.ingredients.split(",").map((i) => i.trim()) : ["Special homemade blend"],
        steps: formData.instructions ? formData.instructions.split(". ").map((s) => s.trim()).filter(Boolean) : ["Follow authentic traditional cooking method."],
      };
      localStorage.setItem("flavorcraft_recipes_store", JSON.stringify([newRecipeEntry, ...existing]));

      const existingAudit = JSON.parse(localStorage.getItem("flavorcraft_audit_store") || "[]");
      existingAudit.unshift({
        id: "a_" + Date.now(),
        action: `New recipe "${formData.name}" submitted for moderation triage`,
        actor: newRecipeEntry.publisherName,
        time: "Just now",
        category: "recipe",
      });
      localStorage.setItem("flavorcraft_audit_store", JSON.stringify(existingAudit));
    } catch (err) {
      console.warn("Could not sync to local storage", err);
    }

    setMessage(
      `Submission complete: Recipe "${formData.name}" has been routed to the administrative console for moderation triage.`,
    );

    // Reset form
    setFormData({
      name: "",
      cuisine: "Indian",
      time: "",
      difficulty: "Easy",
      publisherName: currentUser?.name || "",
      publisherContact: currentUser?.email || "",
      ingredients: "",
      instructions: "",
    });
    handleRemoveImage();
  }

  return (
    <div className="add-recipe-page">
      <Navbar />

      <main className="add-recipe-main">
        <section className="add-recipe-intro">
          <h1>Share Your Signature Dish</h1>
          <p>
            Contribute your authentic home recipe to the FlavorCraft culinary
            community. Provide clear step-by-step instructions and your contact
            details.
          </p>
        </section>

        {!isLoggedIn ? (
          /* Login Required Gate */
          <div className="login-required-card">
            <div className="login-required-icon">
              <img
                src="/icons/auth-required.png"
                alt=""
                className="login-required-icon"
              />
            </div>
            <h2>Authentication Required</h2>
            <p>
              You must be logged in to share a recipe with the FlavorCraft
              community. Please log in or create a free account to publish your
              dish.
            </p>
            <div className="login-required-actions">
              <Link to="/login" className="btn-auth-primary">
                Log In to Share ➔
              </Link>
              <Link to="/signup" className="btn-auth-secondary">
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          /* Recipe Form when Logged In */
          <div className="recipe-form-card">
            <form className="recipe-form" onSubmit={handleSubmit}>
              {/* Section 1: Publisher Info */}
              <div className="form-section-title">
                <span>👤</span> Publisher Information
              </div>

              <div className="form-row">
                <label>
                  Publisher Name *
                  <input
                    name="publisherName"
                    onChange={handleChange}
                    placeholder="e.g. Chef Mario"
                    required
                    type="text"
                    value={formData.publisherName}
                  />
                </label>

                <label>
                  Publisher Contact Info *
                  <input
                    name="publisherContact"
                    onChange={handleChange}
                    placeholder="Email or Phone number"
                    required
                    type="text"
                    value={formData.publisherContact}
                  />
                </label>
              </div>

              {/* Section 2: Recipe Details */}
              <div className="form-section-title" style={{ marginTop: "16px" }}>
                <span></span> Recipe Details
              </div>

              <div className="form-row">
                <label>
                  Recipe Title *
                  <input
                    name="name"
                    onChange={handleChange}
                    placeholder="e.g. Garlic Butter Naan"
                    required
                    type="text"
                    value={formData.name}
                  />
                </label>

                <label>
                  Cuisine / Origin *
                  <select
                    name="cuisine"
                    onChange={handleChange}
                    value={formData.cuisine}
                  >
                    {cuisineOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="form-row">
                <label>
                  Preparation Time *
                  <input
                    name="time"
                    onChange={handleChange}
                    placeholder="e.g. 30 min"
                    required
                    type="text"
                    value={formData.time}
                  />
                </label>

                <label>
                  Difficulty Level *
                  <select
                    name="difficulty"
                    onChange={handleChange}
                    value={formData.difficulty}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </label>
              </div>

              {/* Image File Upload Input */}
              <label>
                Upload Recipe Image File *
                <div className="file-input-wrapper">
                  {!imagePreviewUrl ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                  ) : (
                    <div className="image-preview-container">
                      <img
                        src={imagePreviewUrl}
                        alt="Recipe Preview"
                        className="image-preview-thumb"
                      />
                      <div className="image-preview-info">
                        <span>📷 {selectedFile?.name}</span>
                        <small>
                          {(selectedFile?.size / 1024).toFixed(1)} KB • Image
                          selected
                        </small>
                        <button
                          type="button"
                          className="btn-remove-image"
                          onClick={handleRemoveImage}
                        >
                          ✕ Remove Image
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </label>

              <label>
                Ingredients (comma or newline separated) *
                <textarea
                  name="ingredients"
                  onChange={handleChange}
                  placeholder="Chicken, Butter, Tomatoes, Cream..."
                  required
                  rows={4}
                  value={formData.ingredients}
                />
              </label>

              <label>
                Step-by-step Instructions *
                <textarea
                  name="instructions"
                  onChange={handleChange}
                  placeholder="1. Marinate chicken...&#10;2. Heat pan..."
                  required
                  rows={5}
                  value={formData.instructions}
                />
              </label>

              <button className="submit-recipe-button" type="submit">
                Publish Recipe ➔
              </button>

              {message && <div className="form-message">{message}</div>}
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default AddRecipe;
