const express = require("express");
const {
  enrollInCourse,
  unenrollFromCourse,
  getMyCourses,
  checkMyEnrollment,
  getCourseEnrollments,
} = require("../controllers/enrollmentController");
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

// --- User Routes (Protected) ---
// POST /api/enrollments - Enroll logged-in user in a course (pass courseId in body)
router.post("/", protect, enrollInCourse);

// GET /api/enrollments/my-courses - Get courses the logged-in user is enrolled in
router.get("/my-courses", protect, getMyCourses);

// GET /api/enrollments/check/:courseId - Check if logged-in user is enrolled in a course
router.get("/check/:courseId", protect, checkMyEnrollment);

// DELETE /api/enrollments/:courseId - Unenroll logged-in user from a course
router.delete("/:courseId", protect, unenrollFromCourse);


// --- Admin Routes (Protected + Admin Role Check) ---
// GET /api/enrollments/course/:courseId - Get all users enrolled in a specific course
router.get("/course/:courseId", protect, isAdmin, getCourseEnrollments);


module.exports = router;

