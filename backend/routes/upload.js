// backend/routes/upload.js
const router = require("express").Router();
const upload = require("../middleware/uploadMiddleware");
const { uploadImage } = require("../controllers/uploadController");
const { auth } = require("../../db");
const { protect } = auth;

// POST /api/upload - Upload a single image (field name: "image")
router.post("/", protect, upload.single("image"), uploadImage);

module.exports = router;
