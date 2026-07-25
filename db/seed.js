// gggg/db/seed.js
// Database Seeder Script for MongoDB

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('./db');
const { User, Category, Recipe } = require('./models');
const seedData = require('./seedData.json');

const populateDatabase = async () => {
  try {
    console.log('🚀 Connecting to Database...');
    await connectDB();

    console.log('🧹 Cleaning existing collections...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Recipe.deleteMany({});

    console.log('👤 Seeding Users...');
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('admin123', salt);

    const createdUsers = await User.insertMany(
      seedData.users.map(u => ({ ...u, password: defaultPassword }))
    );
    const adminUser = createdUsers.find(u => u.role === 'admin') || createdUsers[0];
    console.log(`✅ ${createdUsers.length} Users seeded.`);

    console.log('🏷️ Seeding Categories...');
    const createdCategories = await Category.insertMany(
      seedData.categories.map(name => ({ name }))
    );
    console.log(`✅ ${createdCategories.length} Categories seeded.`);

    console.log('🍲 Seeding Recipes...');
    const createdRecipes = await Recipe.insertMany(
      seedData.recipes.map(r => ({ ...r, createdBy: adminUser._id }))
    );
    console.log(`✅ ${createdRecipes.length} Recipes seeded.`);

    console.log('🎉 Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database Seeding Error:', error.message);
    process.exit(1);
  }
};

populateDatabase();
