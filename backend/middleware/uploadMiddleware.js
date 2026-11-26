// backend/middleware/uploadMiddleware.js
// Hardened Multer configuration for secure image uploads

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const uploadsDir = path.join(__dirname, "..", "uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Allowed MIME types and corresponding extensions (strictly raster images, SVG excluded to prevent Stored XSS)
const MIME_EXTENSION_MAP = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate cryptographically unguessable filename to prevent collisions & directory traversal
    const randomHex = crypto.randomBytes(16).toString("hex");
    const safeExt = MIME_EXTENSION_MAP[file.mimetype] || path.extname(file.originalname).toLowerCase();
    cb(null, `recipe-${Date.now()}-${randomHex}${safeExt}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMime = Object.keys(MIME_EXTENSION_MAP).includes(file.mimetype);
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext);

  if (allowedMime && allowedExt) {
    return cb(null, true);
  }

  cb(
    new Error(
      "Security Error: Invalid file format. Only JPEG, PNG, and WebP images are allowed. SVG and executable files are prohibited."
    )
  );
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Single file per request
  }
});

module.exports = upload;
