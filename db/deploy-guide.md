# 🚀 Member 1: Database & Deployment Guide

This guide covers everything required by **Member 1 (DB & Deployment)** to configure MongoDB, run seed scripts, troubleshoot Atlas connections, and deploy database services.

---

## 📦 1. Database Setup

### Option A: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas Console](https://cloud.mongodb.com) and create a free M0 Cluster.
2. Under **Security -> Database Access**, create a database user (e.g. `noor-hassan`).
3. Under **Security -> Network Access**, click **Add IP Address**:
   - For local development / broad deployment access, add `0.0.0.0/0` (Allow Access from Anywhere).
4. Get your connection string:
   `mongodb+srv://<username>:<password>@<cluster-url>/recipe_sharing_db?retryWrites=true&w=majority`
5. Place the URI in `db/.env`:
   ```env
   MONGO_URI=mongodb+srv://user:password@cluster0.xxx.mongodb.net/recipe_sharing_db
   ```

### Option B: Local MongoDB
1. Start MongoDB locally (`mongod` or via Windows Service).
2. Set in `db/.env`:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/recipe_sharing_db
   ```

---

## 🛠️ 2. Database Management CLI Commands

Navigate to `db/` and run:

```bash
# 1. Install dependencies
npm install

# 2. Test DB Connection & Output collection stats
npm test

# 3. Seed initial users, categories, recipes, and ratings
npm run seed

# 4. Wipe/Reset DB back to empty
npm run reset
```

---

## 🐳 3. Docker Deployment

To build and run the DB container:

```bash
docker build -t recipe-db-runner .
docker run --env-file .env recipe-db-runner
```

---

## ☁️ 4. Cloud Deployment (Render / Vercel)

* **Render Deployment**: Use the provided [`render.yaml`](file:///n:/gggg/db/render.yaml) blueprint to deploy to Render automatically.
* **Vercel Frontend**: Member 2's UI in `flavor_craft/` is deployed to Vercel/Netlify using the `VITE_API_BASE_URL` environment variable.
