// gggg/db/db.js
// MongoDB connection configuration for Recipe Sharing Website

const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env in db folder or parent folder
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  const primaryURI = process.env.MONGO_URI;
  const fallbackURI = 'mongodb://127.0.0.1:27017/recipe_sharing_db';

  if (primaryURI) {
    try {
      const conn = await mongoose.connect(primaryURI, { serverSelectionTimeoutMS: 4000 });
      console.log(`✅ MongoDB Connected (Cloud): ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.warn(`⚠️ Cloud MongoDB Connection failed (${error.message}). Trying local fallback...`);
    }
  }

  try {
    const conn = await mongoose.connect(fallbackURI, { serverSelectionTimeoutMS: 4000 });
    console.log(`✅ MongoDB Connected (Local): ${conn.connection.host}`);
    return conn;
  } catch (fallbackError) {
    console.error(`❌ Local MongoDB Connection Error: ${fallbackError.message}`);
    console.log('⚠️ Server running, but MongoDB is offline. Configure MONGO_URI in .env or start mongod locally.');
  }
};

module.exports = connectDB;
module.exports.connectDB = connectDB;
