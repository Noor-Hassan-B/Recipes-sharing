// db/auth.js
// Authentication & Security Module: Token Management, Password Hashing & Authorization Middleware

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL SECURITY ERROR: JWT_SECRET environment variable is missing in production!');
  }
  return 'dev_secure_flavorcraft_jwt_secret_key_987654321';
};

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate a JWT token for a given payload or user object
 * @param {Object} payload 
 * @param {String} expiresIn 
 * @returns {String} JWT Token
 */
const generateToken = (payload, expiresIn = JWT_EXPIRES_IN) => {
  const secret = getJwtSecret();
  const data = payload._id
    ? { id: payload._id, email: payload.email, role: payload.role }
    : payload;

  return jwt.sign(data, secret, { expiresIn });
};

/**
 * Verify and decode a JWT token
 * @param {String} token 
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
  try {
    const secret = getJwtSecret();
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid or expired authentication token');
  }
};

/**
 * Hash a plain-text password using bcryptjs
 * @param {String} password 
 * @returns {Promise<String>} Hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12); // Strengthened to cost factor 12
  return await bcrypt.hash(password, salt);
};

/**
 * Compare a plain-text password against a hashed password
 * @param {String} password 
 * @param {String} hashedPassword 
 * @returns {Promise<Boolean>} Match result
 */
const comparePassword = async (password, hashedPassword) => {
  if (!password || !hashedPassword) return false;
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Express Middleware: Protect routes with JWT verification
 * Expects header: "Authorization: Bearer <token>"
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (!token || token.trim() === '') {
        return res.status(401).json({ success: false, message: 'Authentication token missing.' });
      }

      const decoded = verifyToken(token);
      const User = require('./models/User');

      // Attach user object without password to request
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User associated with token no longer exists.' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized: token validation failed.' });
    }
  }

  return res.status(401).json({ success: false, message: 'Not authorized: no token provided.' });
};

/**
 * Express Middleware: Restrict access to admin role only
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied: Admin privileges required.' });
};

module.exports = {
  getJwtSecret,
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  protect,
  adminOnly
};
