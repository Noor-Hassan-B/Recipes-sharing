// gggg/db/index.js
// Main entry point for Database module: Database connection, Mongoose models, and Auth/Security middleware

const connectDB = require('./db');
const models = require('./models');
const auth = require('./auth');

module.exports = {
  connectDB,
  ...models,
  auth
};
