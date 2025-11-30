import usuarioRepository from "../repositories/user.repository.js";
import { compare as bcryptCompare, hash as bcryptHash } from '../utils/bcrypt.js';

class UserController {


  async getUsers(req, res) {
    const users = await usuarioRepository.findAll();
    return res.json(users);
  }

 
  async getUser(req, res) {
    const { id } = req.params;

    const user = await usuarioRepository.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json(user);
  }


  async updateUser(req, res) {
    const { id } = req.params;

    const result = await usuarioRepository.update(id, req.body);

    if (!result) {
      return res.status(400).json({ message: "No se pudo actualizar" });
    }

    return res.json({ message: "Usuario actualizado correctamente" });
  }


  async deleteUser(req, res) {
    const { id } = req.params;

    const result = await usuarioRepository.delete(id);

    if (!result) {
      return res.status(400).json({ message: "No se pudo eliminar" });
    }

    return res.json({ message: "Usuario eliminado correctamente" });
  }

  async getMe(req, res) {
    const id = req.user.id;  // viene del middleware

    const user = await usuarioRepository.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json(user);
  }


  async updateMe(req, res) {
    const id = req.user.id;

    // If user wants to change password, verify old password and hash new one
    if (req.body.oldPassword && req.body.password) {
      const existing = await usuarioRepository.findById(id);
      if (!existing) return res.status(404).json({ message: "Usuario no encontrado" });
      const match = await bcryptCompare(req.body.oldPassword, existing.password);
      if (!match) return res.status(400).json({ message: "Contraseña actual incorrecta" });
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
      const hashed = await bcryptHash(req.body.password, saltRounds);
      req.body.password = hashed;
      delete req.body.oldPassword;
    }

    const result = await usuarioRepository.update(id, req.body);

    if (!result) {
      return res.status(400).json({ message: "No se pudo actualizar el perfil" });
    }

    return res.json({ message: "Perfil actualizado correctamente" });
  }
}

export default new UserController();
