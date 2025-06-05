const pool = require("../config/db");
const { hashPassword } = require("../utils/authUtils");
const { v4: uuidv4 } = require("uuid"); // Import uuid

const findUserByEmail = async (email) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  const [rows] = await pool.execute(sql, [email]);
  return rows[0];
};

const findUserById = async (id) => {
  const sql = "SELECT id, name, email, role, avatar_url, created_at FROM users WHERE id = ?";
  const [rows] = await pool.execute(sql, [id]);
  return rows[0];
};

const createUser = async (name, email, password) => {
  const hashedPassword = await hashPassword(password);
  const newUserId = uuidv4(); // Generate UUID
  const sql = "INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)";
  await pool.execute(sql, [newUserId, name, email, hashedPassword, "user"]);
  // Fetch the created user since MySQL INSERT doesn't return the row directly like RETURNING
  return findUserById(newUserId);
};

// Admin function to get all users
const findAllUsers = async () => {
    const sql = "SELECT id, name, email, role, avatar_url, created_at FROM users ORDER BY created_at DESC";
    const [rows] = await pool.execute(sql);
    return rows;
};

// Function to update user profile (by user themselves or admin)
const updateUser = async (id, userData) => {
    const fields = [];
    const values = [];
    let sql = "UPDATE users SET ";

    if (userData.name !== undefined) {
        fields.push("name = ?");
        values.push(userData.name);
    }
    if (userData.email !== undefined) {
        // Optional: Add check if email is already taken by another user before executing
        fields.push("email = ?");
        values.push(userData.email);
    }
    if (userData.password) {
        const hashedPassword = await hashPassword(userData.password);
        fields.push("password_hash = ?");
        values.push(hashedPassword);
    }
    if (userData.role !== undefined) { // Typically only admin should change role
        fields.push("role = ?");
        values.push(userData.role);
    }
    if (userData.avatar_url !== undefined) {
        fields.push("avatar_url = ?");
        values.push(userData.avatar_url);
    }

    if (fields.length === 0) {
        // No fields to update, return the existing user
        return findUserById(id);
    }

    sql += fields.join(", ");
    sql += " WHERE id = ?";
    values.push(id);

    await pool.execute(sql, values);
    // Fetch the updated user data
    return findUserById(id);
};

// Admin function to delete a user
const deleteUser = async (id) => {
    const sql = "DELETE FROM users WHERE id = ?";
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows > 0; // Check if any row was actually deleted
};


module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  findAllUsers,
  updateUser,
  deleteUser,
};

