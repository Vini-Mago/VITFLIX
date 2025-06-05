const userModel = require("../models/userModel");
const { comparePassword, generateToken } = require("../utils/authUtils");

const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Nome, email e senha são obrigatórios." });
  }

  try {
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email já está em uso." });
    }

    const newUser = await userModel.createUser(name, email, password);
    // Omit password hash from the response
    const { password_hash, ...userWithoutPassword } = newUser;

    // Generate token for the new user
    const token = generateToken(newUser.id, newUser.role);

    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error("Erro no registro:", error);
    next(error); // Pass error to the error handling middleware
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }

  try {
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas." }); // User not found
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciais inválidas." }); // Incorrect password
    }

    // Omit password hash from the response user object
    const { password_hash, ...userWithoutPassword } = user;

    const token = generateToken(user.id, user.role);

    res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error("Erro no login:", error);
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};

