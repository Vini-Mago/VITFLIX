const express = require("express");
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
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

// --- Public Routes ---
// GET /api/courses?categoryId=... (Filter by category)
// GET /api/courses (Get all courses)
router.get("/", getAllCourses);
router.get("/:id", getCourseById); // Get course details including videos and files

// --- Admin Routes (Protected + Admin Role Check) ---
router.post("/", protect, isAdmin, createCourse);
router.put("/:id", protect, isAdmin, updateCourse);
router.delete("/:id", protect, isAdmin, deleteCourse);

module.exports = router;

