const { verifyToken } = require("../utils/authUtils");
const userModel = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ message: "Não autorizado, token inválido." });
      }

      // Get user from the token (excluding password)
      // Attach user to the request object
      req.user = await userModel.findUserById(decoded.id);

      if (!req.user) {
         return res.status(401).json({ message: "Não autorizado, usuário não encontrado." });
      }

      next();
    } catch (error) {
      console.error("Erro na autenticação:", error);
      res.status(401).json({ message: "Não autorizado, token falhou." });
    }
  } else {
    res.status(401).json({ message: "Não autorizado, nenhum token fornecido." });
  }
};

module.exports = { protect };

