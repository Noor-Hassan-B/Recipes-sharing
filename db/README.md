# 🗄️ Database Management & Configuration Guide

Welcome to the **Database Role** workspace for the Recipe Sharing project (`gggg/db`). This module handles all database models, MongoDB connectivity, seed data, and schema management.

---

## ⚙️ Environment Configuration (`.env`)

Configure your local or cloud MongoDB connection string in `.env` (or `db/.env`):

```env
# MongoDB Connection String
MONGO_URI=mongodb://127.0.0.1:27017/recipe_sharing_db

# Database Name
DB_NAME=recipe_sharing_db

# Environment
NODE_ENV=development
```

---

## 🛠️ DB Utilities & NPM Commands

Run these commands inside `gggg/db`:

- **Test Database Connection**:
  ```bash
  npm run test
  ```
  *(or `node testConnection.js`)*

- **Seed Database with Sample Data & Admin User**:
  ```bash
  npm run seed
  ```
  *(or `node seed.js`)*

- **Reset / Clear All Collections**:
  ```bash
  npm run reset
  ```
  *(or `node resetDB.js`)*

---

## 📂 File Architecture

```text
gggg/db/
├── .env                # Active environment configuration
├── .env.example        # Environment configuration template
├── package.json        # DB dependencies & CLI scripts
├── db.js               # MongoDB connection setup (Mongoose + dotenv)
├── testConnection.js   # CLI utility to test DB connection & inspect record counts
├── resetDB.js          # CLI utility to wipe all DB collections
├── seed.js             # Automated DB seeder script
├── seedData.json       # JSON dataset containing initial Users, Categories & Recipes
└── models/             # Mongoose Schemas & Data Models
    ├── index.js        # Export wrapper for all models
    ├── User.js         # User profiles & auth schema
    ├── Recipe.js       # Recipe details schema
    ├── Category.js     # Category classification schema
    ├── Rating.js       # User ratings (1-5 stars) schema
    ├── Comment.js      # User comments schema
    └── Favorite.js     # User bookmarks schema
```
