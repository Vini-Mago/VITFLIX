const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define storage location and filename strategy
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define different upload directories based on file type or purpose if needed
    // For simplicity, using a single 'uploads' directory for now.
    // Ensure the directory exists
    const uploadPath = path.join(__dirname, "../../uploads"); // Adjust path as needed
    fs.mkdirSync(uploadPath, { recursive: true }); // Create directory if it doesn't exist
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Create a unique filename to avoid collisions
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

// Optional: File filter to accept only specific file types
const fileFilter = (req, file, cb) => {
  // Example: Accept only images and videos for general uploads
  // You might want more specific filters for different routes (e.g., only images for avatars)
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/") ||
    file.mimetype === "application/pdf" // Example: Allow PDFs for course files
    // Add other allowed MIME types as needed
  ) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de arquivo não suportado!"), false);
  }
};

// Configure multer instance
const upload = multer({
  storage: storage,
  // limits: { fileSize: 1024 * 1024 * 50 }, // Optional: Limit file size (e.g., 50MB)
  // fileFilter: fileFilter, // Optional: Apply file filter
});

module.exports = upload;

