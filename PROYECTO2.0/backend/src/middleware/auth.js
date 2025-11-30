import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Usuario from "../models/user.js";

dotenv.config();

export const isAuthenticated = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ message: "No autorizado" });
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) return res.status(401).json({ message: "Token inválido" });
    const user = await Usuario.findByPk(decoded.userId);
    if (!user) return res.status(401).json({ message: "Usuario no encontrado" });
    req.user = { id: user.id, correo: user.correo, tipoUsuario: user.tipoUsuario };
    next();
  } catch (err) {
    console.error("auth error:", err.message);
    return res.status(401).json({ message: "No autorizado" });
  }
};

export const isAdmin = (req, res, next) => {
  const u = req.user;
  if (!u) return res.status(401).json({ message: "No autorizado" });
  // Accept case-insensitive 'admin' values to avoid mismatches from token/user casing
  if (!u.tipoUsuario || String(u.tipoUsuario).toLowerCase() !== "admin") return res.status(403).json({ message: "Acceso reservado a administradores" });
  next();
};

export default { isAuthenticated, isAdmin };



