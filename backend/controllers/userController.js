// backend/controllers/userController.js
// Secure User Management Controller

const { User } = require("../../db");
const validator = require("validator");

// POST /register or POST / - Register new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Email lowercase & normalized
    const sanitizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists."
      });
    }

    // Role is strictly locked to 'user' for public registration (Privilege Escalation protection)
    const user = await User.create({
      name: name.trim(),
      email: sanitizedEmail,
      password,
      role: "user"
    });

    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /login - Authenticate user & get JWT token
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter both email and password." });
    }

    const sanitizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: sanitizedEmail });

    // Generic error message to prevent user enumeration attacks
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = user.generateAuthToken();

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /me - Get current logged-in user profile (Protected)
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// GET / - Get all users (Admin Protected to prevent Data Scraping / Enumeration)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /:id - Get public user profile (Non-admin gets sanitized public card only)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // If caller is admin or self, return full profile; otherwise return public fields only
    const isSelf = req.user && req.user._id.toString() === user._id.toString();
    const isAdmin = req.user && req.user.role === "admin";

    if (isSelf || isAdmin) {
      return res.json(user);
    }

    res.json({
      _id: user._id,
      name: user.name,
      profileImage: user.profileImage,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe, getUsers, getUserById };
