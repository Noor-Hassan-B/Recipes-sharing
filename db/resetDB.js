// gggg/db/resetDB.js
// Utility script to clear all collections in the database

const connectDB = require('./db');
const { User, Recipe, Category, Rating, Comment, Favorite } = require('./models');

const resetDatabase = async () => {
  try {
    console.log('⚠️ Connecting to Database for Reset...');
    await connectDB();

    console.log('🧹 Wiping all database collections...');
    await User.deleteMany({});
    await Recipe.deleteMany({});
    await Category.deleteMany({});
    await Rating.deleteMany({});
    await Comment.deleteMany({});
    await Favorite.deleteMany({});

    console.log('✅ All Database Collections Successfully Wiped!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Reset Failed:', error.message);
    process.exit(1);
  }
};

resetDatabase();
