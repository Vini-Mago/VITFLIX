const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const createCategory = async (title, description, imageUrl) => {
  const newCategoryId = uuidv4();
  const sql = "INSERT INTO categories (id, title, description, image_url) VALUES (?, ?, ?, ?)";
  await pool.execute(sql, [newCategoryId, title, description, imageUrl]);
  return findCategoryById(newCategoryId); // Fetch the created category
};

const findAllCategories = async () => {
  // Fetch categories and also count the number of courses in each category
  const sql = `
    SELECT 
      c.id, c.title, c.description, c.image_url, c.created_at, 
      COUNT(co.id) AS course_count
    FROM categories c
    LEFT JOIN courses co ON c.id = co.category_id
    GROUP BY c.id, c.title, c.description, c.image_url, c.created_at
    ORDER BY c.title ASC;
  `;
  const [rows] = await pool.execute(sql);
  // Convert COUNT result from string to number if necessary (depends on mysql2 config)
  return rows.map(row => ({ ...row, course_count: Number(row.course_count) }));
};

const findCategoryById = async (id) => {
  // Fetch category details and also count the number of courses
  const sql = `
    SELECT 
      c.id, c.title, c.description, c.image_url, c.created_at, 
      COUNT(co.id) AS course_count
    FROM categories c
    LEFT JOIN courses co ON c.id = co.category_id
    WHERE c.id = ?
    GROUP BY c.id, c.title, c.description, c.image_url, c.created_at;
  `;
  const [rows] = await pool.execute(sql, [id]);
  if (rows.length > 0) {
      return { ...rows[0], course_count: Number(rows[0].course_count) };
  }
  return null; // Or undefined, or throw an error
};

const updateCategory = async (id, categoryData) => {
  const fields = [];
  const values = [];
  let sql = "UPDATE categories SET ";

  if (categoryData.title !== undefined) {
    fields.push("title = ?");
    values.push(categoryData.title);
  }
  if (categoryData.description !== undefined) {
    fields.push("description = ?");
    values.push(categoryData.description);
  }
  if (categoryData.image_url !== undefined) {
    fields.push("image_url = ?");
    values.push(categoryData.image_url);
  }

  if (fields.length === 0) {
    return findCategoryById(id); // No fields to update
  }

  sql += fields.join(", ");
  sql += " WHERE id = ?";
  values.push(id);

  await pool.execute(sql, values);
  // Fetch again to include course count after update
  return findCategoryById(id);
};

const deleteCategory = async (id) => {
  // Note: Consider implications if categories have courses. 
  // The current schema uses ON DELETE SET NULL for courses.category_id.
  
  // Optional check: Prevent deletion if category has courses
  /*
  const [courseCheck] = await pool.execute("SELECT 1 FROM courses WHERE category_id = ? LIMIT 1", [id]);
  if (courseCheck.length > 0) {
      throw new Error("Não é possível excluir a categoria pois ela contém cursos associados.");
  }
  */

  const sql = "DELETE FROM categories WHERE id = ?";
  const [result] = await pool.execute(sql, [id]);
  return result.affectedRows > 0;
};

module.exports = {
  createCategory,
  findAllCategories,
  findCategoryById,
  updateCategory,
  deleteCategory,
};

