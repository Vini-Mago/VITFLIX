require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { errorHandler } = require("./src/middleware/errorMiddleware");

// Import routes
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const courseRoutes = require("./src/routes/courseRoutes");
const videoRoutes = require("./src/routes/videoRoutes");
const fileRoutes = require("./src/routes/fileRoutes");
const enrollmentRoutes = require("./src/routes/enrollmentRoutes");
const uploadRoutes = require("./src/routes/uploadRoutes");

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust in production)
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Static files middleware - Serve files from the 'uploads' directory
// Make sure the path is correct relative to where this script runs
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount Routes
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/upload", uploadRoutes);

// Root endpoint for basic check
app.get("/", (req, res) => {
  res.send("EduFlix Backend is running!");
});

// Error Handling Middleware (should be the last middleware)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  // Log database connection status (optional, handled in db.js)
});

// Export app for potential testing or other uses (optional)
module.exports = app;

