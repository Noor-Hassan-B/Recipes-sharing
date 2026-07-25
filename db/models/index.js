// gggg/db/models/index.js
// Export all Database Models for easy import

const User = require('./User');
const Recipe = require('./Recipe');
const Category = require('./Category');
const Rating = require('./Rating');
const Comment = require('./Comment');
const Favorite = require('./Favorite');

module.exports = {
  User,
  Recipe,
  Category,
  Rating,
  Comment,
  Favorite
};
