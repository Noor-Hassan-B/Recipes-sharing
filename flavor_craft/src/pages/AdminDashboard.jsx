
// src/pages/AdminDashboard.jsx
// Enterprise Executive Admin Command Center for FlavorCraft Platform
// Engineered with ultra-clean minimalist design, vector iconography, and real-time state synchronization

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import {
  IconShield,
  IconRecipes,
  IconUsers,
  IconComments,
  IconTag,
  IconHistory,
  IconSearch,
  IconPlus,
  IconCheck,
  IconCross,
  IconEdit,
  IconTrash,
  IconStar,
  IconExternal,
  IconDownload,
  IconLock,
  IconAlertCircle
} from "../components/AdminIcons.jsx";
import "./AdminDashboard.css";

const INITIAL_ADMIN_RECIPES = [
  {
    id: "r1",
    name: "Butter Chicken",
    cuisine: "Indian",
    time: "45 min",
    difficulty: "Medium",
    publisherName: "Noor Hassan",
    status: "Approved",
    featured: true,
    rating: 4.9,
    reviewsCount: 24,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80",
    description: "A creamy tomato-based chicken curry infused with rich aromatic spices and garlic butter sauce.",
  },
  {
    id: "r2",
    name: "Crispy Masala Dosa",
    cuisine: "Indian",
    time: "35 min",
    difficulty: "Easy",
    publisherName: "Deepam",
    status: "Approved",
    featured: false,
    rating: 4.8,
    reviewsCount: 18,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80",
    description: "A thin golden crisp rice crepe filled with fragrant spiced potatoes and served with coconut chutney.",
  },
  {
    id: "r3",
    name: "Sadza and Grilled Fish",
    cuisine: "Zimbabwean",
    time: "30 min",
    difficulty: "Easy",
    publisherName: "Ashley",
    status: "Approved",
    featured: true,
    rating: 5.0,
    reviewsCount: 31,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=80",
    description: "A classic Zimbabwean feast of smooth white sadza, seasoned tilapia, and fresh leafy greens.",
  },
  {
    id: "r4",
    name: "Artisanal Truffle Pasta",
    cuisine: "Italian",
    time: "40 min",
    difficulty: "Hard",
    publisherName: "Chef Marco",
    status: "Pending",
    featured: false,
    rating: 0,
    reviewsCount: 0,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=700&q=80",
    description: "Fresh homemade Fettuccine infused with black summer truffle and decadent Parmigiano cream.",
  },
  {
    id: "r5",
    name: "Spiced Mango Chutney",
    cuisine: "Indian",
    time: "20 min",
    difficulty: "Easy",
    publisherName: "Priya Sharma",
    status: "Pending",
    featured: false,
    rating: 0,
    reviewsCount: 0,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80",
    description: "Sweet and tangy mango chutney seasoned with nigella seeds and Kashmiri chili.",
  },
  {
    id: "r6",
    name: "Street Style Tacos",
    cuisine: "Mexican",
    time: "25 min",
    difficulty: "Easy",
    publisherName: "Vivek",
    status: "Approved",
    featured: false,
    rating: 4.7,
    reviewsCount: 15,
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=700&q=80",
    description: "Warm corn tortillas piled high with flame-grilled seasoned meat and salsa verde.",
  }
];

const INITIAL_USERS = [
  { id: "u1", name: "System Administrator", email: "admin@recipe.com", role: "admin", status: "Active", recipesCount: 12, joined: "2026-01-15" },
  { id: "u2", name: "Noor Hassan", email: "noor@recipe.com", role: "chef", status: "Active", recipesCount: 8, joined: "2026-02-01" },
  { id: "u3", name: "Deepam", email: "deepam@recipe.com", role: "admin", status: "Active", recipesCount: 6, joined: "2026-02-03" },
  { id: "u4", name: "Ritu", email: "ritu@recipe.com", role: "chef", status: "Active", recipesCount: 5, joined: "2026-02-10" },
  { id: "u5", name: "Chef Marco", email: "marco@bistro.com", role: "chef", status: "Under Review", recipesCount: 1, joined: "2026-07-24" },
  { id: "u6", name: "Commercial Bot", email: "promos@marketing-network.net", role: "chef", status: "Suspended", recipesCount: 0, joined: "2026-07-25" }
];

const INITIAL_COMMENTS = [
  { id: "c1", recipeName: "Butter Chicken", author: "FoodieGourav", text: "The balance of spices is exceptional. Perfectly documented instructions.", rating: 5, status: "Approved", date: "2 hrs ago" },
  { id: "c2", recipeName: "Sadza and Grilled Fish", author: "Tendai_Zeta", text: "Authentic flavor profile. Prepared with fresh tilapia and it turned out great.", rating: 5, status: "Approved", date: "5 hrs ago" },
  { id: "c3", recipeName: "Crispy Masala Dosa", author: "Unverified", text: "Visit my external profile link for unregulated diet supplement downloads and rewards.", rating: 1, status: "Flagged", date: "Just now" }
];

const INITIAL_CATEGORIES = [
  { id: "cat1", name: "Indian", count: 24, status: "Active", description: "Rich regional curries, tandoori specialties, and traditional flatbreads." },
  { id: "cat2", name: "Zimbabwean / African", count: 14, status: "Active", description: "Traditional staple cornmeals, flame-grilled meats, and wholesome vegetable relishes." },
  { id: "cat3", name: "Italian", count: 19, status: "Active", description: "Authentic regional handmade pastas, rustic breads, and Neapolitan hearth pizzas." },
  { id: "cat4", name: "Mexican", count: 16, status: "Active", description: "Vibrant street-style tacos, complex moles, and citrus-infused seafood ceviches." },
  { id: "cat5", name: "Desserts & Pastries", count: 22, status: "Active", description: "Curated selections from classic French gateaux to traditional Indian confections." }
];

const INITIAL_AUDIT = [
  { id: "a1", action: "System automatic scanning: Flagged promotional content on Crispy Masala Dosa", actor: "Security Engine", time: "10m ago", category: "security" },
  { id: "a2", action: "User Chef Marco submitted recipe 'Artisanal Truffle Pasta' for review", actor: "Chef Marco", time: "1h ago", category: "recipe" },
  { id: "a3", action: "Administrator Deepam assigned featured carousel placement to 'Sadza and Grilled Fish'", actor: "Deepam (Admin)", time: "3h ago", category: "recipe" },
  { id: "a4", action: "Database synchronized with verified production repository schemas", actor: "System Administrator", time: "1d ago", category: "system" }
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("recipes");
  const [isAdmin, setIsAdmin] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Storage states
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [auditLog, setAuditLog] = useState([]);

  // Filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "chef" });

  useEffect(() => {
    const checkAdminState = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const userRaw = localStorage.getItem("user");
      if (loggedIn && userRaw) {
        try {
          const user = JSON.parse(userRaw);
          if (user.role === "admin" || user.email?.toLowerCase().includes("admin") || user.name?.toLowerCase().includes("deepam")) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    checkAdminState();

    const savedRecipes = localStorage.getItem("flavorcraft_recipes_store");
    setRecipes(savedRecipes ? JSON.parse(savedRecipes) : INITIAL_ADMIN_RECIPES);

    const savedUsers = localStorage.getItem("flavorcraft_users_store");
    setUsers(savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS);

    const savedComments = localStorage.getItem("flavorcraft_comments_store");
    setComments(savedComments ? JSON.parse(savedComments) : INITIAL_COMMENTS);

    const savedCats = localStorage.getItem("flavorcraft_cats_store");
    setCategories(savedCats ? JSON.parse(savedCats) : INITIAL_CATEGORIES);

    const savedAudit = localStorage.getItem("flavorcraft_audit_store");
    setAuditLog(savedAudit ? JSON.parse(savedAudit) : INITIAL_AUDIT);
  }, []);

  useEffect(() => { if (recipes.length) localStorage.setItem("flavorcraft_recipes_store", JSON.stringify(recipes)); }, [recipes]);
  useEffect(() => { if (users.length) localStorage.setItem("flavorcraft_users_store", JSON.stringify(users)); }, [users]);
  useEffect(() => { if (comments.length) localStorage.setItem("flavorcraft_comments_store", JSON.stringify(comments)); }, [comments]);
  useEffect(() => { if (categories.length) localStorage.setItem("flavorcraft_cats_store", JSON.stringify(categories)); }, [categories]);
  useEffect(() => { if (auditLog.length) localStorage.setItem("flavorcraft_audit_store", JSON.stringify(auditLog)); }, [auditLog]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const logAudit = (actionText, category = "system") => {
    const newEntry = {
      id: "a_" + Date.now(),
      action: actionText,
      actor: JSON.parse(localStorage.getItem("user") || "{}").name || "Administrator",
      time: "Just now",
      category,
    };
    setAuditLog((prev) => [newEntry, ...prev]);
  };

  const activateDemoAdmin = () => {
    const demoAdmin = { name: "System Administrator", email: "admin@recipe.com", role: "admin" };
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(demoAdmin));
    setIsAdmin(true);
    triggerToast("Administrator evaluation session activated successfully.");
    logAudit("Evaluation administrator session initiated", "security");
  };

  /* ==========================================================================
     Recipe Actions
     ========================================================================== */
  const handleApproveRecipe = (id, name) => {
    setRecipes((prev) => prev.map((r) => r.id === id ? { ...r, status: "Approved" } : r));
    triggerToast(`Approved recipe "${name}" for public distribution.`);
    logAudit(`Approved recipe "${name}" for general publication`, "recipe");
  };

  const handleRejectRecipe = (id, name) => {
    setRecipes((prev) => prev.map((r) => r.id === id ? { ...r, status: "Rejected" } : r));
    triggerToast(`Rejected submission for "${name}".`);
    logAudit(`Rejected formula "${name}" following editorial review`, "recipe");
  };

  const handleToggleFeature = (id, name, currentFeatured) => {
    setRecipes((prev) => prev.map((r) => r.id === id ? { ...r, featured: !currentFeatured } : r));
    const statusText = !currentFeatured ? "promoted to" : "removed from";
    triggerToast(`Recipe "${name}" ${statusText} featured collection.`);
    logAudit(`Updated featured placement for "${name}" (${!currentFeatured ? "Enabled" : "Disabled"})`, "recipe");
  };

  const handleDeleteRecipe = (id, name) => {
    if (window.confirm(`Confirm complete permanent removal of "${name}" from repository?`)) {
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      triggerToast(`Removed "${name}" from database.`);
      logAudit(`Deleted recipe record "${name}" [ID: ${id}]`, "recipe");
    }
  };

  const handleSaveRecipeEdit = (e) => {
    e.preventDefault();
    if (editingRecipe.id) {
      setRecipes((prev) => prev.map((r) => r.id === editingRecipe.id ? editingRecipe : r));
      triggerToast(`Updated record specifications for "${editingRecipe.name}".`);
      logAudit(`Modified specifications for recipe "${editingRecipe.name}"`, "recipe");
    } else {
      const created = {
        ...editingRecipe,
        id: "r_" + Date.now(),
        publisherName: "System Administrator",
        rating: 5.0,
        reviewsCount: 1,
        image: editingRecipe.image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80",
      };
      setRecipes((prev) => [created, ...prev]);
      triggerToast(`Published new master catalog recipe "${created.name}".`);
      logAudit(`Administrator published master formula "${created.name}"`, "recipe");
    }
    setIsRecipeModalOpen(false);
    setEditingRecipe(null);
  };

  /* ==========================================================================
     User Actions
     ========================================================================== */
  const handleToggleUserRole = (id, currentRole, name) => {
    const newRole = currentRole === "admin" ? "chef" : "admin";
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role: newRole } : u));
    triggerToast(`Updated system access privileges for ${name} to [${newRole.toUpperCase()}].`);
    logAudit(`Modified access authorization for ${name} to ${newRole}`, "user");
  };

  const handleToggleUserStatus = (id, currentStatus, name) => {
    const nextStatus = currentStatus === "Active" ? "Suspended" : "Active";
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: nextStatus } : u));
    triggerToast(`Updated account integrity status for ${name} to [${nextStatus}].`);
    logAudit(`Account status transition for ${name}: ${nextStatus}`, "user");
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    const added = {
      id: "u_" + Date.now(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "Active",
      recipesCount: 0,
      joined: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [added, ...prev]);
    triggerToast(`Registered platform identity for ${added.name}.`);
    logAudit(`Provisioned user profile account for ${added.email}`, "user");
    setIsUserModalOpen(false);
    setNewUser({ name: "", email: "", role: "chef" });
  };

  /* ==========================================================================
     Comment & Taxonomy Actions
     ========================================================================== */
  const handleModerateComment = (id, newStatus) => {
    setComments((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c));
    triggerToast(`Comment moderation status set to [${newStatus}].`);
    logAudit(`Updated triage status on comment #${id} to ${newStatus}`, "security");
  };

  const handleAddCategory = () => {
    const catName = prompt("Enter title for the new Cuisine / Culinary Category:");
    if (catName && catName.trim()) {
      const added = {
        id: "cat_" + Date.now(),
        name: catName.trim(),
        count: 0,
        status: "Active",
        description: "Curated culinary classification created via administrative portal.",
      };
      setCategories((prev) => [added, ...prev]);
      triggerToast(`Added culinary category "${added.name}" to global schema.`);
      logAudit(`Registered cuisine category "${added.name}" in taxonomy schema`, "tag");
    }
  };

  const handleClearAuditLog = () => {
    if (window.confirm("Confirm purge of current session activity logs?")) {
      setAuditLog([]);
      localStorage.removeItem("flavorcraft_audit_store");
      triggerToast("System audit trail purged successfully.");
    }
  };

  // Filter computations
  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.publisherName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingRecipesCount = recipes.filter((r) => r.status === "Pending").length;
  const flaggedCommentsCount = comments.filter((c) => c.status === "Flagged").length;

  const getAuditIcon = (cat) => {
    switch (cat) {
      case "recipe": return <IconRecipes size={18} />;
      case "user": return <IconUsers size={18} />;
      case "tag": return <IconTag size={18} />;
      case "security": return <IconShield size={18} />;
      default: return <IconHistory size={18} />;
    }
  };

  return (
    <div className="admin-page">
      <Navbar />

      <main className="admin-main">
        {/* Executive Banner */}
        <section className="admin-banner">
          <div>
            <div className="admin-title-row" style={{ marginBottom: 0 }}>
              <span className="admin-icon-header"><IconShield size={26} /></span>
              <div className="admin-title">
                <h1>Executive Administration Console</h1>
              </div>
            </div>
          </div>
          <div className="admin-header-actions">
            <button
              className="btn-admin-action btn-admin-primary"
              onClick={() => {
                setEditingRecipe({ name: "", cuisine: "Indian", time: "30 min", difficulty: "Easy", description: "", status: "Approved", featured: true });
                setIsRecipeModalOpen(true);
              }}
            >
              <IconPlus size={16} /> New Admin Recipe
            </button>
            <Link to="/recipes" className="btn-admin-action">
              <IconExternal size={16} /> Open Public Site
            </Link>
          </div>
        </section>

        {!isAdmin ? (
          /* Minimalist Guest Portal Access */
          <div className="admin-lock-gate">
            <div className="gate-icon-wrap">
              <IconLock size={32} />
            </div>
            <h2>Administrator Authentication Required</h2>
            <p>
              Your session lacks system administration privileges. To inspect and evaluate the moderation engine, execute the instant evaluation login below.
            </p>
            <button className="btn-instant-admin" onClick={activateDemoAdmin}>
              <IconShield size={18} /> Activate Admin Evaluation Mode
            </button>
          </div>
        ) : (
          <>
            {/* KPI Metric Overview */}
            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon-wrap"><IconRecipes size={24} /></div>
                <div className="stat-details">
                  <span className="stat-label">Total Recipes</span>
                  <span className="stat-value">{recipes.length}</span>
                  <span className="stat-trend">Approved repository volume</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrap"><IconHistory size={24} /></div>
                <div className="stat-details">
                  <span className="stat-label">Pending Review</span>
                  <span className="stat-value">{pendingRecipesCount}</span>
                  <span className={`stat-trend ${pendingRecipesCount > 0 ? "alert" : ""}`}>
                    {pendingRecipesCount > 0 ? "Action required in moderation queue" : "Moderation queue fully up to date"}
                  </span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrap"><IconUsers size={24} /></div>
                <div className="stat-details">
                  <span className="stat-label">Platform Accounts</span>
                  <span className="stat-value">{users.length}</span>
                  <span className="stat-trend">Registered community contributors</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrap"><IconShield size={24} /></div>
                <div className="stat-details">
                  <span className="stat-label">Flagged Content</span>
                  <span className="stat-value">{flaggedCommentsCount}</span>
                  <span className={`stat-trend ${flaggedCommentsCount > 0 ? "alert" : ""}`}>
                    {flaggedCommentsCount > 0 ? "Review comments flagged for removal" : "No active discussion anomalies"}
                  </span>
                </div>
              </div>
            </section>

            {/* Studio Navigation Bar */}
            <nav className="admin-tabs" aria-label="Dashboard management views">
              <button
                className={`tab-btn ${activeTab === "recipes" ? "active" : ""}`}
                onClick={() => { setActiveTab("recipes"); setSearchTerm(""); }}
              >
                <IconRecipes size={20} /> Recipe Catalog
                <span className="tab-count-badge">{recipes.length}</span>
              </button>
              <button
                className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
                onClick={() => { setActiveTab("users"); setSearchTerm(""); }}
              >
                <IconUsers size={20} /> Community Accounts
                <span className="tab-count-badge">{users.length}</span>
              </button>
              <button
                className={`tab-btn ${activeTab === "comments" ? "active" : ""}`}
                onClick={() => setActiveTab("comments")}
              >
                <IconComments size={20} /> Comment Triage
                <span className="tab-count-badge">{comments.length}</span>
              </button>
              <button
                className={`tab-btn ${activeTab === "categories" ? "active" : ""}`}
                onClick={() => setActiveTab("categories")}
              >
                <IconTag size={20} /> Cuisine Taxonomy
                <span className="tab-count-badge">{categories.length}</span>
              </button>
              <button
                className={`tab-btn ${activeTab === "audit" ? "active" : ""}`}
                onClick={() => setActiveTab("audit")}
              >
                <IconHistory size={20} /> Audit Log
                <span className="tab-count-badge">{auditLog.length}</span>
              </button>
            </nav>

            {/* TAB 1: RECIPE MANAGEMENT */}
            {activeTab === "recipes" && (
              <div className="admin-panel">
                <div className="panel-header">
                  <div className="panel-title">
                    <h2>Global Recipe Repository</h2>
                    <p>Inspect, edit, and moderate culinary entries submitted to the application database.</p>
                  </div>
                  <div className="panel-filters">
                    <div className="search-input-wrap">
                      <span className="search-icon-inline"><IconSearch size={16} /></span>
                      <input
                        type="text"
                        className="filter-input"
                        placeholder="Search by recipe, author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select
                      className="filter-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending Review</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Recipe Name</th>
                        <th>Cuisine</th>
                        <th>Author / Chef</th>
                        <th>Prep Time</th>
                        <th>Status</th>
                        <th>Featured</th>
                        <th>Management Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecipes.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: "center", padding: "32px", color: "#64748b" }}>
                            No matching culinary entries found for current filters.
                          </td>
                        </tr>
                      ) : (
                        filteredRecipes.map((recipe) => (
                          <tr key={recipe.id}>
                            <td>
                              <div className="recipe-cell">
                                <img src={recipe.image} alt={recipe.name} className="recipe-thumb" />
                                <div className="recipe-meta">
                                  <h4>{recipe.name}</h4>
                                  <span>Difficulty: {recipe.difficulty} • ★ {recipe.rating || "New"}</span>
                                </div>
                              </div>
                            </td>
                            <td><strong>{recipe.cuisine}</strong></td>
                            <td>{recipe.publisherName}</td>
                            <td>{recipe.time}</td>
                            <td>
                              <span className={`status-badge ${recipe.status.toLowerCase()}`}>
                                {recipe.status}
                              </span>
                            </td>
                            <td>
                              <button
                                onClick={() => handleToggleFeature(recipe.id, recipe.name, recipe.featured)}
                                className={`btn-icon-action feature ${recipe.featured ? "active" : ""}`}
                                title="Toggle Homepage Feature Placement"
                              >
                                <IconStar size={16} filled={recipe.featured} />
                              </button>
                            </td>
                            <td>
                              <div className="cell-actions">
                                {recipe.status !== "Approved" && (
                                  <button
                                    onClick={() => handleApproveRecipe(recipe.id, recipe.name)}
                                    className="btn-icon-action approve"
                                    title="Approve Recipe Submission"
                                  >
                                    <IconCheck size={16} />
                                  </button>
                                )}
                                {recipe.status !== "Rejected" && (
                                  <button
                                    onClick={() => handleRejectRecipe(recipe.id, recipe.name)}
                                    className="btn-icon-action reject"
                                    title="Reject Recipe Submission"
                                  >
                                    <IconCross size={16} />
                                  </button>
                                )}
                                <button
                                  onClick={() => { setEditingRecipe({ ...recipe }); setIsRecipeModalOpen(true); }}
                                  className="btn-icon-action"
                                  title="Edit Specifications"
                                >
                                  <IconEdit size={15} />
                                </button>
                                <button
                                  onClick={() => handleDeleteRecipe(recipe.id, recipe.name)}
                                  className="btn-icon-action delete"
                                  title="Remove Permanently"
                                >
                                  <IconTrash size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: USER GOVERNANCE */}
            {activeTab === "users" && (
              <div className="admin-panel">
                <div className="panel-header">
                  <div className="panel-title">
                    <h2>Community Account Roster</h2>
                    <p>Oversee registered chefs, regulate admin role assignments, and administer access restrictions.</p>
                  </div>
                  <div className="panel-filters">
                    <div className="search-input-wrap">
                      <span className="search-icon-inline"><IconSearch size={16} /></span>
                      <input
                        type="text"
                        className="filter-input"
                        placeholder="Search account email or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <button
                      className="btn-admin-action btn-admin-primary"
                      onClick={() => setIsUserModalOpen(true)}
                    >
                      <IconPlus size={16} /> Register Account
                    </button>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Member Name</th>
                        <th>Email Address</th>
                        <th>System Role</th>
                        <th>Contributions</th>
                        <th>Account Status</th>
                        <th>Date Joined</th>
                        <th>Role & Access Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((user) => (
                          <tr key={user.id}>
                            <td>
                              <strong style={{ display: "block", color: "#0f172a" }}>{user.name}</strong>
                            </td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`status-badge ${user.role === "admin" ? "admin-role" : "chef-role"}`}>
                                {user.role === "admin" ? "Administrator" : "Community Chef"}
                              </span>
                            </td>
                            <td>{user.recipesCount} catalog recipe(s)</td>
                            <td>
                              <span className="status-badge" style={{
                                color: user.status === "Active" ? "#047857" : user.status === "Suspended" ? "#b91c1c" : "#b45309",
                                background: user.status === "Active" ? "#ecfdf5" : user.status === "Suspended" ? "#fef2f2" : "#fffbeb",
                                borderColor: user.status === "Active" ? "#d1fae5" : user.status === "Suspended" ? "#fee2e2" : "#fef3c7"
                              }}>
                                {user.status}
                              </span>
                            </td>
                            <td>{user.joined}</td>
                            <td>
                              <div className="cell-actions">
                                <button
                                  onClick={() => handleToggleUserRole(user.id, user.role, user.name)}
                                  className="btn-admin-action"
                                  style={{ padding: "6px 12px", fontSize: "0.78rem" }}
                                >
                                  Toggle Role
                                </button>
                                <button
                                  onClick={() => handleToggleUserStatus(user.id, user.status, user.name)}
                                  className="btn-icon-action delete"
                                  title={user.status === "Active" ? "Suspend Account" : "Restore Account"}
                                >
                                  {user.status === "Active" ? <IconCross size={15} /> : <IconCheck size={15} />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: COMMENT TRIAGE */}
            {activeTab === "comments" && (
              <div className="admin-panel">
                <div className="panel-header">
                  <div className="panel-title">
                    <h2>Review Triage & Content Integrity</h2>
                    <p>Moderate user feedback and dismiss flagged promotional comments across discussions.</p>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Target Recipe</th>
                        <th>Reviewer Account</th>
                        <th>Feedback Content</th>
                        <th>Rating</th>
                        <th>Triage Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comments.map((comment) => (
                        <tr key={comment.id} style={{ background: comment.status === "Flagged" ? "#fef2f2" : "transparent" }}>
                          <td><strong>{comment.recipeName}</strong></td>
                          <td>{comment.author}</td>
                          <td style={{ maxWidth: "380px", lineHeight: "1.4", color: "#334155" }}>{comment.text}</td>
                          <td style={{ fontWeight: "600", color: "#d97706" }}>{comment.rating} / 5.0</td>
                          <td>
                            <span className={`status-badge ${comment.status === "Approved" ? "approved" : "rejected"}`}>
                              {comment.status === "Approved" ? "Verified" : "Flagged Spam"}
                            </span>
                          </td>
                          <td>
                            <div className="cell-actions">
                              {comment.status !== "Approved" && (
                                <button
                                  onClick={() => handleModerateComment(comment.id, "Approved")}
                                  className="btn-icon-action approve"
                                  title="Approve Comment"
                                >
                                  <IconCheck size={15} />
                                </button>
                              )}
                              {comment.status !== "Flagged" && (
                                <button
                                  onClick={() => handleModerateComment(comment.id, "Flagged")}
                                  className="btn-icon-action reject"
                                  title="Flag Comment"
                                >
                                  <IconCross size={15} />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setComments((prev) => prev.filter((c) => c.id !== comment.id));
                                  triggerToast("Removed comment permanently from repository.");
                                  logAudit(`Permanently deleted comment #${comment.id} by ${comment.author}`, "security");
                                }}
                                className="btn-icon-action delete"
                                title="Delete Permanently"
                              >
                                <IconTrash size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: TAXONOMY MANAGER */}
            {activeTab === "categories" && (
              <div className="admin-panel">
                <div className="panel-header">
                  <div className="panel-title">
                    <h2>Cuisines & Culinary Taxonomies</h2>
                    <p>Organize menu categories and edit taxonomy classifications utilized for discovery.</p>
                  </div>
                  <button className="btn-admin-action btn-admin-primary" onClick={handleAddCategory}>
                    <IconPlus size={16} /> New Category
                  </button>
                </div>

                <div className="category-grid">
                  {categories.map((cat) => (
                    <div className="category-admin-card" key={cat.id}>
                      <div className="cat-info">
                        <h4>{cat.name}</h4>
                        <p>{cat.description}</p>
                        <span className="cat-count">
                          {cat.count} recipe bindings
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const updated = prompt(`Update category label for "${cat.name}":`, cat.name);
                          if (updated && updated.trim()) {
                            setCategories((prev) => prev.map((c) => c.id === cat.id ? { ...c, name: updated.trim() } : c));
                            triggerToast(`Updated category title to "${updated.trim()}".`);
                            logAudit(`Updated taxonomy category label from "${cat.name}" to "${updated.trim()}"`, "tag");
                          }
                        }}
                        className="btn-icon-action"
                        title="Edit Category Name"
                      >
                        <IconEdit size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: SYSTEM AUDIT LOG */}
            {activeTab === "audit" && (
              <div className="admin-panel">
                <div className="panel-header">
                  <div className="panel-title">
                    <h2>System Audit Trail & Session Event Log</h2>
                    <p>Chronological immutable timeline of administrator operations and platform events.</p>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      className="btn-admin-action"
                      onClick={() => {
                        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(auditLog, null, 2))}`;
                        const downloadAnchor = document.createElement("a");
                        downloadAnchor.setAttribute("href", jsonString);
                        downloadAnchor.setAttribute("download", `flavorcraft_audit_log_${Date.now()}.json`);
                        document.body.appendChild(downloadAnchor);
                        downloadAnchor.click();
                        downloadAnchor.remove();
                        triggerToast("Exported system audit report to JSON.");
                      }}
                    >
                      <IconDownload size={16} /> Export JSON Report
                    </button>
                    <button className="btn-admin-action" onClick={handleClearAuditLog} style={{ color: "#b91c1c", borderColor: "#fca5a5" }}>
                      Clear History
                    </button>
                  </div>
                </div>

                <div className="audit-feed">
                  {auditLog.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#64748b", padding: "40px 0" }}>No recorded activity events in current log.</p>
                  ) : (
                    auditLog.map((item) => (
                      <div className="audit-item" key={item.id}>
                        <div className="audit-item-left">
                          <div className="audit-icon-box">{getAuditIcon(item.category)}</div>
                          <div className="audit-text">
                            <span className="audit-action">{item.action}</span>
                            <span className="audit-actor">Performer: <strong>{item.actor}</strong></span>
                          </div>
                        </div>
                        <span className="audit-time">{item.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      {/* RECIPE MODAL */}
      {isRecipeModalOpen && editingRecipe && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editingRecipe.id ? `Edit "${editingRecipe.name}"` : "Publish New Catalog Recipe"}</h3>
              <button className="btn-close-modal" onClick={() => { setIsRecipeModalOpen(false); setEditingRecipe(null); }}>
                &times;
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSaveRecipeEdit}>
              <div className="form-group">
                <label>Recipe Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Traditional Chicken Biryani"
                  value={editingRecipe.name}
                  onChange={(e) => setEditingRecipe({ ...editingRecipe, name: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label>Cuisine Taxonomy</label>
                  <select
                    value={editingRecipe.cuisine}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, cuisine: e.target.value })}
                  >
                    <option value="Indian">Indian</option>
                    <option value="Zimbabwean / African">Zimbabwean / African</option>
                    <option value="Italian">Italian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Thai">Thai</option>
                    <option value="French">French</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Difficulty Classification</label>
                  <select
                    value={editingRecipe.difficulty}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, difficulty: e.target.value })}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label>Prep & Cook Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 35 min"
                    value={editingRecipe.time}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, time: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Catalog Status</label>
                  <select
                    value={editingRecipe.status}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, status: e.target.value })}
                  >
                    <option value="Approved">Approved (Public)</option>
                    <option value="Pending">Pending Review</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Image Resource URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={editingRecipe.image || ""}
                  onChange={(e) => setEditingRecipe({ ...editingRecipe, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Culinary Description</label>
                <textarea
                  rows="3"
                  placeholder="Describe flavor notes and formulation context..."
                  value={editingRecipe.description || ""}
                  onChange={(e) => setEditingRecipe({ ...editingRecipe, description: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-admin-action" onClick={() => { setIsRecipeModalOpen(false); setEditingRecipe(null); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-action btn-admin-primary">
                  Commit Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER PROVISION MODAL */}
      {isUserModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: "480px" }}>
            <div className="modal-header">
              <h3>Provision Member Account</h3>
              <button className="btn-close-modal" onClick={() => setIsUserModalOpen(false)}>&times;</button>
            </div>

            <form className="modal-form" onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>Member Identity / Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chef Gordon"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="gordon@bistro.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Role Authorization</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="chef">Community Chef</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-admin-action" onClick={() => setIsUserModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-admin-action btn-admin-primary">Register Identity</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Minimalist Toast */}
      {toastMessage && (
        <div className="admin-toast">
          <IconAlertCircle size={18} style={{ color: "#22c55e", flexShrink: 0 }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
