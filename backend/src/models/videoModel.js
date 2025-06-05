const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const createVideo = async (videoData) => {
  const { course_id, title, description, video_url, thumbnail_url, order } = videoData;
  
  // Ensure course exists before creating video
  const [courseCheck] = await pool.execute("SELECT 1 FROM courses WHERE id = ?", [course_id]);
  if (courseCheck.length === 0) {
      throw new Error("Curso não encontrado para associar ao vídeo.");
  }

  const newVideoId = uuidv4();
  const sql = "INSERT INTO videos (id, course_id, title, description, video_url, thumbnail_url, `order`) VALUES (?, ?, ?, ?, ?, ?, ?)";
  await pool.execute(sql, [newVideoId, course_id, title, description, video_url, thumbnail_url, order]);
  
  return findVideoById(newVideoId); // Fetch the created video
};

// Find videos by course ID, ordered by the 'order' field
const findVideosByCourse = async (courseId) => {
  const sql = "SELECT * FROM videos WHERE course_id = ? ORDER BY `order` ASC";
  const [rows] = await pool.execute(sql, [courseId]);
  return rows;
};

const findVideoById = async (id) => {
  const sql = "SELECT * FROM videos WHERE id = ?";
  const [rows] = await pool.execute(sql, [id]);
  return rows[0];
};

const updateVideo = async (id, videoData) => {
  const fields = [];
  const values = [];
  let sql = "UPDATE videos SET ";

  if (videoData.title !== undefined) {
    fields.push("title = ?");
    values.push(videoData.title);
  }
  if (videoData.description !== undefined) {
    fields.push("description = ?");
    values.push(videoData.description);
  }
  if (videoData.video_url !== undefined) {
    fields.push("video_url = ?");
    values.push(videoData.video_url);
  }
  if (videoData.thumbnail_url !== undefined) {
    fields.push("thumbnail_url = ?");
    values.push(videoData.thumbnail_url);
  }
  if (videoData.order !== undefined) { // Check for undefined as order can be 0
    fields.push("`order` = ?"); // Use backticks for reserved word
    values.push(videoData.order);
  }
  // Note: Changing course_id might require more complex logic or be disallowed

  if (fields.length === 0) {
    return findVideoById(id); // No fields to update
  }

  sql += fields.join(", ");
  sql += " WHERE id = ?";
  values.push(id);

  const [result] = await pool.execute(sql, values);
   if (result.affectedRows === 0) {
      return null; // Video not found or update failed
  }
  return findVideoById(id); // Fetch updated video
};

const deleteVideo = async (id) => {
  const sql = "DELETE FROM videos WHERE id = ?";
  const [result] = await pool.execute(sql, [id]);
  return result.affectedRows > 0;
};

module.exports = {
  createVideo,
  findVideosByCourse,
  findVideoById,
  updateVideo,
  deleteVideo,
};

