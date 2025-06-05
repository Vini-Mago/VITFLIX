const enrollmentModel = require("../models/enrollmentModel");

// Enroll the logged-in user in a course
const enrollInCourse = async (req, res, next) => {
  const userId = req.user.id; // Get user ID from authenticated request
  const { courseId } = req.body; // Get course ID from request body

  if (!courseId) {
    return res.status(400).json({ message: "ID do curso é obrigatório." });
  }

  try {
    const enrollment = await enrollmentModel.enrollUserInCourse(userId, courseId);
    res.status(201).json({ message: "Matrícula realizada com sucesso!", enrollment });
  } catch (error) {
    console.error("Erro ao matricular usuário no curso:", error);
    // Handle specific errors like already enrolled, user/course not found
    if (error.message.includes("já está matriculado") || error.message.includes("não encontrado")) {
        return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// Unenroll the logged-in user from a course
const unenrollFromCourse = async (req, res, next) => {
  const userId = req.user.id;
  const { courseId } = req.params; // Get course ID from route parameter

  try {
    const success = await enrollmentModel.unenrollUserFromCourse(userId, courseId);
    if (!success) {
      // This might happen if the user wasn't enrolled in the first place
      return res.status(404).json({ message: "Matrícula não encontrada para cancelar." });
    }
    res.status(200).json({ message: "Matrícula cancelada com sucesso!" });
  } catch (error) {
    console.error("Erro ao cancelar matrícula do usuário:", error);
    next(error);
  }
};

// Get courses the logged-in user is enrolled in
const getMyCourses = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const courses = await enrollmentModel.findCoursesByUser(userId);
    res.status(200).json(courses);
  } catch (error) {
    console.error("Erro ao buscar cursos matriculados:", error);
    next(error);
  }
};

// Check if the logged-in user is enrolled in a specific course
const checkMyEnrollment = async (req, res, next) => {
    const userId = req.user.id;
    const { courseId } = req.params;
    try {
        const isEnrolled = await enrollmentModel.checkEnrollment(userId, courseId);
        res.status(200).json({ isEnrolled });
    } catch (error) {
        console.error("Erro ao verificar matrícula:", error);
        next(error);
    }
};

// --- Admin Controllers (Optional) ---

// Get all users enrolled in a specific course (Admin only)
const getCourseEnrollments = async (req, res, next) => {
  const { courseId } = req.params;
  try {
    // Optional: Check if course exists first
    const users = await enrollmentModel.findUsersByCourse(courseId);
    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao buscar matrículas do curso:", error);
    next(error);
  }
};

module.exports = {
  enrollInCourse,
  unenrollFromCourse,
  getMyCourses,
  checkMyEnrollment,
  getCourseEnrollments, // Admin function
};

