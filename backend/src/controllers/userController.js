const userModel = require("../models/userModel");

// Get current user's profile
const getMe = async (req, res, next) => {
  try {
    // The user ID is attached to req.user by the auth middleware
    const user = await userModel.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    next(error);
  }
};

// Update current user's profile
const updateMe = async (req, res, next) => {
  const { name, email, password, avatar_url } = req.body;
  const userId = req.user.id;

  // Construct the update data object, only include fields provided
  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (password) updateData.password = password; // Password will be hashed in the model
  if (avatar_url) updateData.avatar_url = avatar_url;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "Nenhum dado fornecido para atualização." });
  }

  try {
    // Optional: Add check if the new email is already taken by another user
    if (email) {
        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser && existingUser.id !== userId) {
            return res.status(400).json({ message: "Email já está em uso por outro usuário." });
        }
    }

    const updatedUser = await userModel.updateUser(userId, updateData);
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuário não encontrado para atualização." });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar perfil do usuário:", error);
    next(error);
  }
};

// --- Admin Controllers ---

// Get all users (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao buscar todos os usuários:", error);
    next(error);
  }
};

// Get user by ID (Admin only)
const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await userModel.findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error);
    next(error);
  }
};

// Update user by ID (Admin only)
const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, password, role, avatar_url } = req.body;

  // Construct the update data object
  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (password) updateData.password = password; // Password will be hashed in the model
  if (role) updateData.role = role;
  if (avatar_url) updateData.avatar_url = avatar_url;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "Nenhum dado fornecido para atualização." });
  }

  try {
     // Optional: Add check if the new email is already taken by another user
    if (email) {
        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser && existingUser.id !== id) {
            return res.status(400).json({ message: "Email já está em uso por outro usuário." });
        }
    }

    const updatedUser = await userModel.updateUser(id, updateData);
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuário não encontrado para atualização." });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar usuário por ID:", error);
    next(error);
  }
};

// Delete user by ID (Admin only)
const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const success = await userModel.deleteUser(id);
    if (!success) {
      return res.status(404).json({ message: "Usuário não encontrado para exclusão." });
    }
    res.status(204).send(); // No content on successful deletion
  } catch (error) {
    console.error("Erro ao excluir usuário por ID:", error);
    // Handle potential foreign key constraint errors if needed
    next(error);
  }
};

module.exports = {
  getMe,
  updateMe,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

