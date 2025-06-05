const fileModel = require("../models/fileModel");
const courseModel = require("../models/courseModel"); // To check if course exists

// Create a new file record (Admin only) - Actual file upload handled separately
const createFileRecord = async (req, res, next) => {
  // This controller assumes the file has already been uploaded and its URL is available.
  // The actual upload logic will be handled by a dedicated upload endpoint/middleware.
  const { course_id, title, description, file_url, file_type, file_size } = req.body;

  if (!course_id || !title || !file_url || !file_type || file_size === undefined) {
    return res.status(400).json({ message: "ID do curso, título, URL do arquivo, tipo e tamanho são obrigatórios." });
  }

  try {
    const newFile = await fileModel.createFile({ course_id, title, description, file_url, file_type, file_size });
    res.status(201).json(newFile);
  } catch (error) {
    console.error("Erro ao criar registro de arquivo:", error);
    if (error.message.includes("Curso não encontrado")) {
        return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// Get all files for a specific course (Public or Protected based on course access)
const getFilesByCourse = async (req, res, next) => {
  const { courseId } = req.params;

  try {
    // Optional: Check if course exists
    const courseExists = await courseModel.findCourseById(courseId);
    if (!courseExists) {
        return res.status(404).json({ message: "Curso não encontrado." });
    }

    const files = await fileModel.findFilesByCourse(courseId);
    res.status(200).json(files);
  } catch (error) {
    console.error("Erro ao buscar arquivos por curso:", error);
    next(error);
  }
};

// Get file by ID (Public or Protected)
const getFileById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const file = await fileModel.findFileById(id);
    if (!file) {
      return res.status(404).json({ message: "Arquivo não encontrado." });
    }
    res.status(200).json(file);
  } catch (error) {
    console.error("Erro ao buscar arquivo por ID:", error);
    next(error);
  }
};

// Update file metadata by ID (Admin only)
const updateFileMetadata = async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const updateData = {};
  if (title) updateData.title = title;
  if (description) updateData.description = description;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "Nenhum dado (título/descrição) fornecido para atualização." });
  }

  try {
    const updatedFile = await fileModel.updateFile(id, updateData);
    if (!updatedFile) {
      return res.status(404).json({ message: "Arquivo não encontrado para atualização." });
    }
    res.status(200).json(updatedFile);
  } catch (error) {
    console.error("Erro ao atualizar metadados do arquivo por ID:", error);
    next(error);
  }
};

// Delete file by ID (Admin only) - Deletes record and should trigger actual file deletion
const deleteFile = async (req, res, next) => {
  const { id } = req.params;
  try {
    // The model's deleteFile function should handle deleting the actual file from storage
    const success = await fileModel.deleteFile(id);
    if (!success) {
      return res.status(404).json({ message: "Arquivo não encontrado para exclusão." });
    }
    res.status(204).send(); // No content on successful deletion
  } catch (error) {
    console.error("Erro ao excluir arquivo por ID:", error);
    // Handle potential errors during file deletion from storage if implemented
    next(error);
  }
};

module.exports = {
  createFileRecord, // Renamed to clarify it only creates the DB record
  getFilesByCourse,
  getFileById,
  updateFileMetadata, // Renamed to clarify it only updates metadata
  deleteFile,
};

