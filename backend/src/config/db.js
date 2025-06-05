require("dotenv").config();
const mysql = require("mysql2/promise"); // Use mysql2/promise for async/await support

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "eduflix_user",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "eduflix_db",
  port: process.env.DB_PORT || 3306, // Default MySQL port
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed
  queueLimit: 0,
});

// Test the connection (optional, but good practice)
pool.getConnection()
  .then(connection => {
    console.log("Conectado ao banco de dados MySQL!");
    connection.release();
  })
  .catch(err => {
    console.error("Erro ao conectar ao MySQL:", err);
  });

// Export the pool for use in models
module.exports = pool;

