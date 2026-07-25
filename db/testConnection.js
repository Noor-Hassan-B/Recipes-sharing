// gggg/db/testConnection.js
// Utility script to verify MongoDB connection and inspect collection counts

const connectDB = require('./db');
const { User, Recipe, Category, Rating, Comment, Favorite } = require('./models');

const testDatabase = async () => {
  try {
    console.log('🔍 Testing MongoDB Connection...');
    const conn = await connectDB();
    console.log(`📡 Connected to Host: ${conn.connection.host}`);
    console.log(`🗃️ Database Name: ${conn.connection.name}`);

    const usersCount = await User.countDocuments();
    const recipesCount = await Recipe.countDocuments();
    const categoriesCount = await Category.countDocuments();
    const ratingsCount = await Rating.countDocuments();
    const commentsCount = await Comment.countDocuments();
    const favoritesCount = await Favorite.countDocuments();

    console.log('\n📊 Database Status Overview:');
    console.log(` 👤 Users: ${usersCount}`);
    console.log(` 🏷️ Categories: ${categoriesCount}`);
    console.log(` 🍲 Recipes: ${recipesCount}`);
    console.log(` ⭐ Ratings: ${ratingsCount}`);
    console.log(` 💬 Comments: ${commentsCount}`);
    console.log(` ❤️ Favorites: ${favoritesCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Connection Test Failed:', error.message);
    process.exit(1);
  }
};

testDatabase();
