const express = require("express");
const { uploadSingleFile, uploadMultipleFiles } = require("../controllers/uploadController");
const upload = require("../middleware/uploadMiddleware"); // Import multer configuration
const { protect } = require("../middleware/authMiddleware");

// Re-use or import isAdmin middleware
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acesso negado. Requer privilégios de administrador.' });
    }
};

const router = express.Router();

// Route for uploading a single file
// The field name in the form-data should be 'file'
router.post("/single", protect, isAdmin, upload.single("file"), uploadSingleFile);

// Optional: Route for uploading multiple files
// The field name in the form-data should be 'files'
// router.post("/multiple", protect, isAdmin, upload.array("files", 10), uploadMultipleFiles); // Example: Allow up to 10 files

// Note: These routes primarily handle the file upload itself and return the file URL/path.
// The frontend would typically call this route first, get the URL, and then 
// call the respective CRUD endpoint (e.g., createCourse, updateVideo) 
// passing the obtained URL in the request body.

module.exports = router;

