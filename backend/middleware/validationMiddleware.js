// backend/middleware/validationMiddleware.js
// Input Validation, Sanitization, and ReDoS Prevention Middleware

const validator = require("validator");
const mongoose = require("mongoose");

/**
 * Escapes any special regex characters to prevent ReDoS / Regex Injection
 * @param {string} text 
 * @returns {string} Escaped regex-safe string
 */
const escapeRegex = (text) => {
  if (typeof text !== "string") return "";
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

/**
 * Validates whether a given string is a valid MongoDB ObjectId
 * @param {string} id 
 * @returns {boolean}
 */
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Validates Registration payload
 */
const validateRegister = (req, res, next) => {
  let { name, email, password } = req.body;

  if (!name || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
    return res.status(400).json({
      success: false,
      message: "Full name must be between 2 and 100 characters."
    });
  }

  if (!email || typeof email !== "string" || !validator.isEmail(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address."
    });
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long."
    });
  }

  // Password complexity: at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) {
    return res.status(400).json({
      success: false,
      message: "Password must contain both letters and numbers."
    });
  }

  // CRITICAL: Block privilege escalation - enforce role to 'user' on public registration
  req.body.name = validator.escape(name.trim());
  req.body.email = email.trim().toLowerCase();
  req.body.role = "user"; // Never allow client-side role override

  next();
};

/**
 * Validates Login payload
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({
      success: false,
      message: "Please enter both email address and password."
    });
  }

  if (!validator.isEmail(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address format."
    });
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

/**
 * Validates Recipe payload (supports full creation on POST or partial update on PUT)
 */
const validateRecipe = (req, res, next) => {
  const isCreate = req.method === "POST";
  const { title, description, ingredients, instructions, category, difficulty, preparationTime } = req.body;

  if (isCreate || title !== undefined) {
    if (!title || typeof title !== "string" || title.trim().length < 2 || title.trim().length > 120) {
      return res.status(400).json({
        success: false,
        message: "Recipe title must be between 2 and 120 characters."
      });
    }
  }

  if (isCreate || description !== undefined) {
    if (!description || typeof description !== "string" || description.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Recipe description must be at least 5 characters long."
      });
    }
  }

  if (isCreate || ingredients !== undefined) {
    if (!ingredients || (!Array.isArray(ingredients) && typeof ingredients !== "string")) {
      return res.status(400).json({
        success: false,
        message: "Please provide recipe ingredients."
      });
    }
  }

  if (isCreate || instructions !== undefined) {
    if (!instructions || typeof instructions !== "string" || instructions.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Cooking instructions must be at least 5 characters long."
      });
    }
  }

  if (difficulty !== undefined) {
    if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Difficulty must be 'Easy', 'Medium', or 'Hard'."
      });
    }
  }

  if (preparationTime !== undefined) {
    const timeNum = Number(preparationTime);
    if (isNaN(timeNum) || timeNum < 1 || timeNum > 1440) {
      return res.status(400).json({
        success: false,
        message: "Preparation time must be a number between 1 and 1440 minutes."
      });
    }
    req.body.preparationTime = timeNum;
  }

  next();
};

/**
 * Validates Comment payload
 */
const validateComment = (req, res, next) => {
  const { text, recipe, recipeId } = req.body;
  const targetRecipe = recipe || recipeId || req.params.id;

  if (!targetRecipe || !isValidObjectId(targetRecipe)) {
    return res.status(400).json({
      success: false,
      message: "A valid recipe ID is required."
    });
  }

  if (!text || typeof text !== "string" || text.trim().length === 0 || text.trim().length > 1000) {
    return res.status(400).json({
      success: false,
      message: "Comment text is required and cannot exceed 1000 characters."
    });
  }

  req.body.text = validator.escape(text.trim());
  next();
};

/**
 * Validates Rating payload
 */
const validateRating = (req, res, next) => {
  const { score, rating, recipe, recipeId } = req.body;
  const targetRecipe = recipe || recipeId || req.params.id;
  const ratingValue = score !== undefined ? score : rating;

  if (!targetRecipe || !isValidObjectId(targetRecipe)) {
    return res.status(400).json({
      success: false,
      message: "A valid recipe ID is required."
    });
  }

  const numRating = Number(ratingValue);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating score must be an integer between 1 and 5."
    });
  }

  req.body.score = Math.round(numRating);
  next();
};

/**
 * Validates MongoDB ObjectId in route params
 */
const validateObjectIdParam = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid identifier: ${paramName}`
      });
    }
    next();
  };
};

module.exports = {
  escapeRegex,
  isValidObjectId,
  validateRegister,
  validateLogin,
  validateRecipe,
  validateComment,
  validateRating,
  validateObjectIdParam
};
