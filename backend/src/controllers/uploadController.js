const path = require("path");

// Controller to handle single file upload and return its path/URL
const uploadSingleFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "Nenhum arquivo foi enviado." });
  }

  // Construct the URL or path to the uploaded file
  // Assuming files are served statically from the /uploads directory
  // The base URL needs to be configured based on the deployment environment
  // For local development, it might be http://localhost:PORT/uploads/filename
  const fileUrl = `/uploads/${req.file.filename}`; // Relative path, frontend/client needs to prepend the base URL

  res.status(200).json({
    message: "Arquivo enviado com sucesso!",
    filePath: req.file.path, // Absolute path on the server (for internal use)
    fileUrl: fileUrl,       // URL to access the file
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });
};

// Placeholder for handling multiple file uploads if needed
const uploadMultipleFiles = (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "Nenhum arquivo foi enviado." });
    }

    const filesInfo = req.files.map(file => ({
        filePath: file.path,
        fileUrl: `/uploads/${file.filename}`,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
    }));

    res.status(200).json({
        message: "Arquivos enviados com sucesso!",
        files: filesInfo,
    });
};

module.exports = {
  uploadSingleFile,
  uploadMultipleFiles,
};

