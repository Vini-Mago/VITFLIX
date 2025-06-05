const videoModel = require("../models/videoModel");
const courseModel = require("../models/courseModel"); // To check if course exists

// Create a new video (Admin only)
const createVideo = async (req, res, next) => {
  const { course_id, title, description, video_url, thumbnail_url, order } = req.body;

  if (!course_id || !title || !video_url || order === undefined) {
    return res.status(400).json({ message: "ID do curso, título, URL do vídeo e ordem são obrigatórios." });
  }

  try {
    // Optional: Verify course exists before creating video (already done in model, but can add here too)
    /*
    const courseExists = await courseModel.findCourseById(course_id);
    if (!courseExists) {
        return res.status(404).json({ message: "Curso não encontrado para associar ao vídeo." });
    }
    */
    const newVideo = await videoModel.createVideo({ course_id, title, description, video_url, thumbnail_url, order });
    res.status(201).json(newVideo);
  } catch (error) {
    console.error("Erro ao criar vídeo:", error);
    if (error.message.includes("Curso não encontrado")) {
        return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// Get all videos for a specific course (Public or Protected based on course access)
// Assuming public for now, adjust if course access is restricted
const getVideosByCourse = async (req, res, next) => {
  const { courseId } = req.params; // Get courseId from route parameter

  try {
    // Optional: Check if course exists
    const courseExists = await courseModel.findCourseById(courseId);
    if (!courseExists) {
        return res.status(404).json({ message: "Curso não encontrado." });
    }

    const videos = await videoModel.findVideosByCourse(courseId);
    res.status(200).json(videos);
  } catch (error) {
    console.error("Erro ao buscar vídeos por curso:", error);
    next(error);
  }
};

// Get video by ID (Public or Protected)
const getVideoById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const video = await videoModel.findVideoById(id);
    if (!video) {
      return res.status(404).json({ message: "Vídeo não encontrado." });
    }
    res.status(200).json(video);
  } catch (error) {
    console.error("Erro ao buscar vídeo por ID:", error);
    next(error);
  }
};

// Update video by ID (Admin only)
const updateVideo = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, video_url, thumbnail_url, order } = req.body;

  const updateData = {};
  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (video_url) updateData.video_url = video_url;
  if (thumbnail_url) updateData.thumbnail_url = thumbnail_url;
  if (order !== undefined) updateData.order = order;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "Nenhum dado fornecido para atualização." });
  }

  try {
    const updatedVideo = await videoModel.updateVideo(id, updateData);
    if (!updatedVideo) {
      return res.status(404).json({ message: "Vídeo não encontrado para atualização." });
    }
    res.status(200).json(updatedVideo);
  } catch (error) {
    console.error("Erro ao atualizar vídeo por ID:", error);
    next(error);
  }
};

// Delete video by ID (Admin only)
const deleteVideo = async (req, res, next) => {
  const { id } = req.params;
  try {
    const success = await videoModel.deleteVideo(id);
    if (!success) {
      return res.status(404).json({ message: "Vídeo não encontrado para exclusão." });
    }
    res.status(204).send(); // No content on successful deletion
  } catch (error) {
    console.error("Erro ao excluir vídeo por ID:", error);
    next(error);
  }
};

module.exports = {
  createVideo,
  getVideosByCourse,
  getVideoById,
  updateVideo,
  deleteVideo,
};

