import { hash as bcryptHash, compare as bcryptCompare } from '../utils/bcrypt.js';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import usuarioRepository from "../repositories/user.repository.js";
import Usuario from "../models/user.js";

dotenv.config();

export const register = async (req, res) => {
  try {
    // Accept several possible field names from frontend and normalize
    const {
      nombre,
      apellido,
      correo,
      password,
      contraseña,
      role,
      tipoUsuario,
      active,
      estado,
      DNI,
      direccion,
      ciudad,
    } = req.body;

    const finalCorreo = correo && correo.toString();
    const finalNombre = nombre || req.body.name || '';
    const finalApellido = apellido || '';
    const rawPassword = password || contraseña;

    // Validar campos mínimos
    if (!finalNombre || !finalCorreo || !rawPassword) {
      return res.status(400).json({ message: "Nombre, correo y contraseña son obligatorios" });
    }

    // Verificar si ya existe
    const existingUser = await Usuario.findOne({ where: { correo: finalCorreo } });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // No permitir que el cliente cree usuarios admin
    // Force tipoUsuario a 'usuario' sin aceptar role/tipoUsuario desde el cliente
    const finalTipoUsuario = "usuario";

    // Mapear estado booleano a enum esperado
    let finalEstado = "activo";
    if (typeof active === 'boolean') finalEstado = active ? 'activo' : 'inactivo';
    else if (estado) finalEstado = estado;

    // Hashear contraseña
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcryptHash(rawPassword, saltRounds);

    // Construir objeto para la base de datos
    const userToCreate = {
      nombre: finalNombre,
      apellido: finalApellido,
      correo: finalCorreo,
      password: hashedPassword,
      tipoUsuario: finalTipoUsuario,
      estado: finalEstado,
      direccion: direccion || null,
      ciudad: ciudad || null,
    };

    const newUser = await usuarioRepository.create(userToCreate);

    return res.status(201).json({
      message: "Usuario creado correctamente",
      user: { id: newUser.id, nombre: newUser.nombre, correo: newUser.correo, tipoUsuario: newUser.tipoUsuario },
    });

  } catch (error) {
    console.error("Error register:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Validación simple
    if (!correo || !password) {
      return res.status(400).json({ message: "Correo y contraseña obligatorios" });
    }

    // Buscar usuario (solicitamos solo los atributos que existen en la tabla)
      // Fetch the user record without forcing a fixed attribute list.
      // Some DBs may be missing optional columns (e.g. 'dni'); fetching the whole row
      // prevents Sequelize from generating SQL that references missing columns.
      const user = await Usuario.findOne({ where: { correo } });

    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Comparar contraseña
    const isValidPassword = await bcryptCompare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Generar token
    const token = jwt.sign(
      { userId: user.id, correo: user.correo , tipoUsuario : user.tipoUsuario},
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login exitoso",
      token,
      user: { id: user.id, nombre: user.nombre, correo: user.correo, tipoUsuario: user.tipoUsuario },
    });

  } catch (error) {
    console.error("Error login:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const me = async (req, res) => {
  try {
    // isAuthenticated middleware already attached user info to req.user
    if (!req.user || !req.user.id) return res.status(401).json({ message: 'No autorizado' });
    const user = await Usuario.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.status(200).json({ id: user.id, nombre: user.nombre, correo: user.correo, tipoUsuario: user.tipoUsuario });
  } catch (err) {
    console.error('Error me:', err);
    return res.status(500).json({ message: 'Error interno' });
  }
};
