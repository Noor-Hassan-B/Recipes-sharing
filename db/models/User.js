// gggg/db/models/User.js
// User Schema for Authentication & Profile Management

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please enter an email address'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: 6
    },
    profileImage: {
      type: String,
      default: '/uploads/default-avatar.png'
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Authentication Token
userSchema.methods.generateAuthToken = function () {
  const secret = process.env.JWT_SECRET || 'recipe_sharing_secret_key_12345';
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = mongoose.model('User', userSchema);
