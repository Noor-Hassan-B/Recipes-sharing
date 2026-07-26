// gggg/db/db.js
// MongoDB connection configuration for Recipe Sharing Website

const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env in db folder or parent folder
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/recipe_sharing_db';
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    console.log('⚠️ Please make sure MongoDB is running or configure MONGO_URI in .env');
    throw error;
  }
};

module.exports = connectDB;
module.exports.connectDB = connectDB;
