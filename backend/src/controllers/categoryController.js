const categoryModel = require("../models/categoryModel");

// Create a new category (Admin only)
const createCategory = async (req, res, next) => {
  const { title, description, image_url } = req.body;

  if (!title) {
    return res.status(400).json({ message: "O título da categoria é obrigatório." });
  }

  try {
    const newCategory = await categoryModel.createCategory(title, description, image_url);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    next(error);
  }
};

// Get all categories (Public)
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryModel.findAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Erro ao buscar todas as categorias:", error);
    next(error);
  }
};

// Get category by ID (Public)
const getCategoryById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const category = await categoryModel.findCategoryById(id);
    if (!category) {
      return res.status(404).json({ message: "Categoria não encontrada." });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Erro ao buscar categoria por ID:", error);
    next(error);
  }
};

// Update category by ID (Admin only)
const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, image_url } = req.body;

  const updateData = {};
  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (image_url) updateData.image_url = image_url;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "Nenhum dado fornecido para atualização." });
  }

  try {
    const updatedCategory = await categoryModel.updateCategory(id, updateData);
    if (!updatedCategory) {
      return res.status(404).json({ message: "Categoria não encontrada para atualização." });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Erro ao atualizar categoria por ID:", error);
    next(error);
  }
};

// Delete category by ID (Admin only)
const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const success = await categoryModel.deleteCategory(id);
    if (!success) {
      return res.status(404).json({ message: "Categoria não encontrada para exclusão." });
    }
    res.status(204).send(); // No content on successful deletion
  } catch (error) {
    console.error("Erro ao excluir categoria por ID:", error);
    // Handle potential errors, e.g., if deletion is restricted due to existing courses
    if (error.message.includes("contém cursos associados")) { // Check for specific error message if implemented in model
        return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

