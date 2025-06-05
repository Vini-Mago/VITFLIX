const courseModel = require("../models/courseModel");

// Create a new course (Admin only)
const createCourse = async (req, res, next) => {
  const { category_id, title, description, instructor, image_url } = req.body;

  if (!category_id || !title || !instructor) {
    return res.status(400).json({ message: "ID da categoria, título e instrutor são obrigatórios." });
  }

  try {
    const newCourse = await courseModel.createCourse({ category_id, title, description, instructor, image_url });
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Erro ao criar curso:", error);
    // Handle specific errors like category not found
    if (error.message.includes("Categoria não encontrada")) {
        return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// Get all courses (Public, with optional category filter)
const getAllCourses = async (req, res, next) => {
  const { categoryId } = req.query; // Filter by category ID if provided
  const filter = {};
  if (categoryId) {
    filter.categoryId = categoryId;
  }

  try {
    const courses = await courseModel.findAllCourses(filter);
    res.status(200).json(courses);
  } catch (error) {
    console.error("Erro ao buscar todos os cursos:", error);
    next(error);
  }
};

// Get course by ID (Public)
const getCourseById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const course = await courseModel.findCourseById(id);
    if (!course) {
      return res.status(404).json({ message: "Curso não encontrado." });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error("Erro ao buscar curso por ID:", error);
    next(error);
  }
};

// Update course by ID (Admin only)
const updateCourse = async (req, res, next) => {
  const { id } = req.params;
  const { category_id, title, description, instructor, image_url } = req.body;

  const updateData = {};
  if (category_id) updateData.category_id = category_id;
  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (instructor) updateData.instructor = instructor;
  if (image_url) updateData.image_url = image_url;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "Nenhum dado fornecido para atualização." });
  }

  try {
    const updatedCourse = await courseModel.updateCourse(id, updateData);
    if (!updatedCourse) {
      return res.status(404).json({ message: "Curso não encontrado para atualização." });
    }
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Erro ao atualizar curso por ID:", error);
    // Handle specific errors like category not found
    if (error.message.includes("Categoria de destino não encontrada")) {
        return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// Delete course by ID (Admin only)
const deleteCourse = async (req, res, next) => {
  const { id } = req.params;
  try {
    const success = await courseModel.deleteCourse(id);
    if (!success) {
      return res.status(404).json({ message: "Curso não encontrado para exclusão." });
    }
    res.status(204).send(); // No content on successful deletion
  } catch (error) {
    console.error("Erro ao excluir curso por ID:", error);
    next(error);
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};

