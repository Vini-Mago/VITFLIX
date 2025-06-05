const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const createFile = async (fileData) => {
  const { course_id, title, description, file_url, file_type, file_size } = fileData;
  
  // Ensure course exists before creating file
  const [courseCheck] = await pool.execute("SELECT 1 FROM courses WHERE id = ?", [course_id]);
  if (courseCheck.length === 0) {
      throw new Error("Curso não encontrado para associar ao arquivo.");
  }

  const newFileId = uuidv4();
  const sql = "INSERT INTO files (id, course_id, title, description, file_url, file_type, file_size) VALUES (?, ?, ?, ?, ?, ?, ?)";
  await pool.execute(sql, [newFileId, course_id, title, description, file_url, file_type, file_size]);
  
  return findFileById(newFileId); // Fetch the created file
};

// Find files by course ID
const findFilesByCourse = async (courseId) => {
  const sql = "SELECT * FROM files WHERE course_id = ? ORDER BY created_at ASC";
  const [rows] = await pool.execute(sql, [courseId]);
  return rows;
};

const findFileById = async (id) => {
  const sql = "SELECT * FROM files WHERE id = ?";
  const [rows] = await pool.execute(sql, [id]);
  return rows[0];
};

const updateFile = async (id, fileData) => {
  const fields = [];
  const values = [];
  let sql = "UPDATE files SET ";

  if (fileData.title !== undefined) {
    fields.push("title = ?");
    values.push(fileData.title);
  }
  if (fileData.description !== undefined) {
    fields.push("description = ?");
    values.push(fileData.description);
  }
  // Typically, file_url, file_type, and file_size are not updated directly via this method

  if (fields.length === 0) {
    return findFileById(id); // No fields to update
  }

  sql += fields.join(", ");
  sql += " WHERE id = ?";
  values.push(id);

  const [result] = await pool.execute(sql, values);
  if (result.affectedRows === 0) {
      return null; // File not found or update failed
  }
  return findFileById(id); // Fetch updated file
};

const deleteFile = async (id) => {
  // Add logic here to delete the actual file from storage (e.g., S3, local disk) before deleting the DB record
  const fileRecord = await findFileById(id);
  if (!fileRecord) {
      return false; // File not found in DB
  }
  // TODO: Implement actual file deletion from storage based on fileRecord.file_url
  console.warn(`Placeholder: Actual file deletion for ${fileRecord.file_url} needs implementation.`);

  const sql = "DELETE FROM files WHERE id = ?";
  const [result] = await pool.execute(sql, [id]);
  return result.affectedRows > 0;
};

module.exports = {
  createFile,
  findFilesByCourse,
  findFileById,
  updateFile,
  deleteFile,
};

