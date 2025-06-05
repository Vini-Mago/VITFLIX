const pool = require("../config/db");

// Enroll a user in a course
const enrollUserInCourse = async (userId, courseId) => {
  // Check if user exists
  const [userCheck] = await pool.execute("SELECT 1 FROM users WHERE id = ?", [userId]);
  if (userCheck.length === 0) {
    throw new Error("Usuário não encontrado.");
  }
  // Check if course exists
  const [courseCheck] = await pool.execute("SELECT 1 FROM courses WHERE id = ?", [courseId]);
  if (courseCheck.length === 0) {
    throw new Error("Curso não encontrado.");
  }
  // Check if already enrolled
  const [enrollmentCheck] = await pool.execute(
    "SELECT 1 FROM enrollments WHERE user_id = ? AND course_id = ?",
    [userId, courseId]
  );
  if (enrollmentCheck.length > 0) {
    // Optionally, just return success or the existing enrollment instead of throwing an error
    // For now, let's return the existing enrollment info
    const [existingEnrollment] = await pool.execute(
        "SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?",
        [userId, courseId]
    );
    console.log("Usuário já matriculado.");
    return existingEnrollment[0]; 
    // throw new Error("Usuário já está matriculado neste curso.");
  }

  const sql = "INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)";
  await pool.execute(sql, [userId, courseId]);
  
  // Fetch the newly created enrollment record
   const [newEnrollment] = await pool.execute(
        "SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?",
        [userId, courseId]
    );
  return newEnrollment[0];
};

// Unenroll a user from a course
const unenrollUserFromCourse = async (userId, courseId) => {
  const sql = "DELETE FROM enrollments WHERE user_id = ? AND course_id = ?";
  const [result] = await pool.execute(sql, [userId, courseId]);
  return result.affectedRows > 0; // Return true if deletion occurred
};

// Find all courses a user is enrolled in
const findCoursesByUser = async (userId) => {
  const sql = `
    SELECT c.id, c.title, c.description, c.instructor, c.image_url, c.created_at, c.category_id, cat.title as category_title, e.enrolled_at
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    LEFT JOIN categories cat ON c.category_id = cat.id
    WHERE e.user_id = ?
    ORDER BY e.enrolled_at DESC;
  `;
  const [rows] = await pool.execute(sql, [userId]);
  return rows;
};

// Find all users enrolled in a specific course (Admin potentially)
const findUsersByCourse = async (courseId) => {
  const sql = `
    SELECT u.id, u.name, u.email, u.avatar_url, e.enrolled_at
    FROM enrollments e
    JOIN users u ON e.user_id = u.id
    WHERE e.course_id = ?
    ORDER BY e.enrolled_at DESC;
  `;
  const [rows] = await pool.execute(sql, [courseId]);
  return rows;
};

// Check if a specific user is enrolled in a specific course
const checkEnrollment = async (userId, courseId) => {
    const sql = "SELECT 1 FROM enrollments WHERE user_id = ? AND course_id = ?";
    const [rows] = await pool.execute(sql, [userId, courseId]);
    return rows.length > 0;
};

module.exports = {
  enrollUserInCourse,
  unenrollUserFromCourse,
  findCoursesByUser,
  findUsersByCourse,
  checkEnrollment,
};

