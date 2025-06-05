const express = require("express");
const {
  createVideo,
  getVideosByCourse,
  getVideoById,
  updateVideo,
  deleteVideo,
} = require("../controllers/videoController");
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
// GET /api/videos?courseId=... (Route defined in course controller/routes is better for fetching by course)
// GET /api/videos/:id (Get specific video details)
router.get("/:id", getVideoById); 

// --- Admin Routes (Protected + Admin Role Check) ---
router.post("/", protect, isAdmin, createVideo);
router.put("/:id", protect, isAdmin, updateVideo);
router.delete("/:id", protect, isAdmin, deleteVideo);

// Note: It's generally better practice to fetch videos related to a course 
// via the course endpoint, e.g., GET /api/courses/:courseId/videos 
// or include them in the GET /api/courses/:id response.
// However, if direct access via /api/videos?courseId=... is needed, 
// a separate route could be added here or handled by a general getAllVideos controller.
// For now, fetching videos by course is handled within the getCourseById model/controller.

module.exports = router;

