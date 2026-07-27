// backend/controllers/uploadController.js
// Handles image upload requests (recipe images, profile avatars)

// POST /api/upload  (protected, single file field name: "image")
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  // Publicly accessible URL, served by the /uploads static route in server.js
  const fileUrl = `/uploads/${req.file.filename}`;

  res.status(201).json({
    success: true,
    message: "File uploaded successfully",
    url: fileUrl,
    filename: req.file.filename
  });
};

module.exports = { uploadImage };
