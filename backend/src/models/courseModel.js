const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const createCourse = async (courseData) => {
  const { category_id, title, description, instructor, image_url } = courseData;
  
  // Ensure category exists before creating course
  const [categoryCheck] = await pool.execute("SELECT 1 FROM categories WHERE id = ?", [category_id]);
  if (categoryCheck.length === 0) {
      throw new Error("Categoria não encontrada para associar ao curso.");
  }

  const newCourseId = uuidv4();
  const sql = "INSERT INTO courses (id, category_id, title, description, instructor, image_url) VALUES (?, ?, ?, ?, ?, ?)";
  await pool.execute(sql, [newCourseId, category_id, title, description, instructor, image_url]);
  
  return findCourseById(newCourseId); // Fetch the created course
};

const findAllCourses = async (filter = {}) => {
  let sql = `
    SELECT 
      co.id, co.title, co.description, co.instructor, co.image_url, co.created_at, 
      co.category_id, cat.title as category_title,
      COUNT(DISTINCT v.id) AS video_count,
      COUNT(DISTINCT f.id) AS file_count
    FROM courses co
    LEFT JOIN categories cat ON co.category_id = cat.id
    LEFT JOIN videos v ON co.id = v.course_id
    LEFT JOIN files f ON co.id = f.course_id
  `;
  const values = [];
  let whereClause = "";

  if (filter.categoryId) {
    whereClause = "WHERE co.category_id = ?";
    values.push(filter.categoryId);
  }

  sql += whereClause;
  // MySQL requires non-aggregated columns in SELECT to be in GROUP BY
  sql += " GROUP BY co.id, co.title, co.description, co.instructor, co.image_url, co.created_at, co.category_id, cat.title ORDER BY co.created_at DESC";

  const [rows] = await pool.execute(sql, values);
  // Convert COUNT results from string to number if necessary
  return rows.map(row => ({
       ...row, 
       video_count: Number(row.video_count),
       file_count: Number(row.file_count) 
    }));
};

const findCourseById = async (id) => {
  // Fetch course details along with category info, videos, and files
  const courseSql = `
    SELECT 
      co.id, co.title, co.description, co.instructor, co.image_url, co.created_at, 
      co.category_id, cat.title as category_title
    FROM courses co
    LEFT JOIN categories cat ON co.category_id = cat.id
    WHERE co.id = ?;
  `;
  const [courseResult] = await pool.execute(courseSql, [id]);
  if (courseResult.length === 0) {
    return null; // Course not found
  }
  const course = courseResult[0];

  // Fetch videos for the course
  const videosSql = "SELECT id, title, description, video_url, thumbnail_url, `order`, created_at FROM videos WHERE course_id = ? ORDER BY `order` ASC";
  const [videosResult] = await pool.execute(videosSql, [id]);
  course.videos = videosResult;

  // Fetch files for the course
  const filesSql = "SELECT id, title, description, file_url, file_type, file_size, created_at FROM files WHERE course_id = ? ORDER BY created_at ASC";
  const [filesResult] = await pool.execute(filesSql, [id]);
  course.files = filesResult;

  return course;
};

const updateCourse = async (id, courseData) => {
  const fields = [];
  const values = [];
  let sql = "UPDATE courses SET ";

  if (courseData.title !== undefined) {
    fields.push("title = ?");
    values.push(courseData.title);
  }
  if (courseData.description !== undefined) {
    fields.push("description = ?");
    values.push(courseData.description);
  }
  if (courseData.instructor !== undefined) {
    fields.push("instructor = ?");
    values.push(courseData.instructor);
  }
  if (courseData.image_url !== undefined) {
    fields.push("image_url = ?");
    values.push(courseData.image_url);
  }
  if (courseData.category_id !== undefined) {
    // Ensure the new category exists
    const [categoryCheck] = await pool.execute("SELECT 1 FROM categories WHERE id = ?", [courseData.category_id]);
    if (categoryCheck.length === 0) {
        throw new Error("Categoria de destino não encontrada.");
    }
    fields.push("category_id = ?");
    values.push(courseData.category_id);
  }

  if (fields.length === 0) {
    return findCourseById(id); // No fields to update
  }

  sql += fields.join(", ");
  sql += " WHERE id = ?";
  values.push(id);

  const [result] = await pool.execute(sql, values);
  if (result.affectedRows === 0) {
      return null; // Course not found or update failed
  }
  // Fetch the updated course details including videos/files
  return findCourseById(id);
};

const deleteCourse = async (id) => {
  // Deleting a course will also delete associated videos and files due to ON DELETE CASCADE
  const sql = "DELETE FROM courses WHERE id = ?";
  const [result] = await pool.execute(sql, [id]);
  return result.affectedRows > 0;
};

module.exports = {
  createCourse,
  findAllCourses,
  findCourseById,
  updateCourse,
  deleteCourse,
};

