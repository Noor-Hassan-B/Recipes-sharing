// db/db.js
// Hardened MongoDB connection configuration with resilient in-memory fallback

const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables securely
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const autoSeedInMemory = async () => {
  try {
    const bcrypt = require('bcryptjs');
    const seedData = require('./seedData.json');
    const { User, Category, Recipe } = require('./models');

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial development data into database...');
      const salt = await bcrypt.genSalt(12);
      const defaultPassword = await bcrypt.hash('Admin@FlavorCraft2026!', salt);

      const createdUsers = await User.insertMany(
        seedData.users.map(u => ({ ...u, password: defaultPassword }))
      );
      const adminUser = createdUsers.find(u => u.role === 'admin') || createdUsers[0];

      await Category.insertMany(
        seedData.categories.map(name => ({ name }))
      );

      await Recipe.insertMany(
        seedData.recipes.map(r => ({ ...r, createdBy: adminUser._id }))
      );
      console.log('✅ Initial database auto-seeded successfully!');
    }
  } catch (err) {
    console.warn('⚠️ Auto-seeding info:', err.message);
  }
};

const connectDB = async () => {
  const primaryURI = process.env.MONGO_URI;
  const fallbackURI = 'mongodb://127.0.0.1:27017/recipe_sharing_db';

  // 1. Attempt connection using primary URI if configured
  if (primaryURI) {
    try {
      const conn = await mongoose.connect(primaryURI, { serverSelectionTimeoutMS: 2000 });
      console.log(`✅ MongoDB Connected (Primary): ${conn.connection.host}`);
      await autoSeedInMemory();
      return conn;
    } catch (error) {
      console.warn(`⚠️ Primary MongoDB Connection failed (${error.message}). Attempting local fallback...`);
    }
  }

  // 2. Attempt connection to local MongoDB instance
  try {
    const conn = await mongoose.connect(fallbackURI, { serverSelectionTimeoutMS: 1500 });
    console.log(`✅ MongoDB Connected (Local): ${conn.connection.host}`);
    await autoSeedInMemory();
    return conn;
  } catch (fallbackError) {
    console.warn(`⚠️ Local MongoDB offline. Starting In-Memory MongoDB Server...`);
    
    // 3. Resilient In-Memory Server Fallback (for zero-setup dev/demo environments)
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✅ MongoDB Connected (In-Memory Server): ${conn.connection.host}`);
      await autoSeedInMemory();
      return conn;
    } catch (memError) {
      console.error(`❌ In-Memory MongoDB Error: ${memError.message}`);
    }
  }
};

module.exports = connectDB;
module.exports.connectDB = connectDB;
