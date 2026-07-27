// gggg/db/db.js
// MongoDB connection configuration for Recipe Sharing Website

const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (dnsErr) {}

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const autoSeedInMemory = async () => {
  try {
    const bcrypt = require('bcryptjs');
    const seedData = require('./seedData.json');
    const { User, Category, Recipe } = require('./models');

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial data into database...');
      const salt = await bcrypt.genSalt(10);
      const defaultPassword = await bcrypt.hash('admin123', salt);

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

  if (primaryURI && !primaryURI.includes('cluster0.ljto0co.mongodb.net')) {
    try {
      const conn = await mongoose.connect(primaryURI, { serverSelectionTimeoutMS: 2000 });
      console.log(`✅ MongoDB Connected (Cloud): ${conn.connection.host}`);
      await autoSeedInMemory();
      return conn;
    } catch (error) {
      console.warn(`⚠️ Cloud MongoDB Connection failed (${error.message}). Trying local fallback...`);
    }
  }

  try {
    const conn = await mongoose.connect(fallbackURI, { serverSelectionTimeoutMS: 1500 });
    console.log(`✅ MongoDB Connected (Local): ${conn.connection.host}`);
    await autoSeedInMemory();
    return conn;
  } catch (fallbackError) {
    console.warn(`⚠️ Local/Cloud MongoDB offline. Starting In-Memory MongoDB Server...`);
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


