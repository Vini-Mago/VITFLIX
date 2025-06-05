const express = require("express");
const {
  createFileRecord,
  getFilesByCourse, // This might be better handled via course routes
  getFileById,
  updateFileMetadata,
  deleteFile,
} = require("../controllers/fileController");
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

// --- Public Routes (or protected based on course access) ---
// GET /api/files/:id (Get specific file details)
router.get("/:id", getFileById);

// --- Admin Routes (Protected + Admin Role Check) ---
// POST /api/files (Creates only the DB record, assumes file URL is provided)
router.post("/", protect, isAdmin, createFileRecord);
// PUT /api/files/:id (Updates metadata like title/description)
router.put("/:id", protect, isAdmin, updateFileMetadata);
// DELETE /api/files/:id (Deletes DB record and should trigger file deletion from storage)
router.delete("/:id", protect, isAdmin, deleteFile);

// Note: Similar to videos, fetching files related to a course is often better handled
// via the course endpoint, e.g., GET /api/courses/:courseId/files
// or included in the GET /api/courses/:id response.
// The getFilesByCourse controller exists but is not routed here by default.

module.exports = router;

