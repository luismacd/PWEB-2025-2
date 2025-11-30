import { Op, fn, col, where as sqWhere } from "sequelize";
import sequelize from "../config/database.js";
import Orden from "../models/orden.js";
import Usuario from "../models/user.js";

export const getSummary = async (req, res) => {
  try {
    // fechas opcionales: from, to como ISO
    const { from, to } = req.query;
    const where = {};
    if (from || to) {
      where.fecha = {};
      if (from) where.fecha[Op.gte] = new Date(from);
      if (to) where.fecha[Op.lte] = new Date(to);
    }

    const totalOrders = await Orden.count({ where });
    // Cast enum to text before applying LOWER to avoid Postgres error: function lower(enum_ordenes_estado) does not exist
    const paidLiteral = sequelize.literal("LOWER(estado::text) = 'pagado'");
    const totalIncomeRow = await Orden.findOne({ where: { [Op.and]: [ where, paidLiteral ] }, attributes: [[fn("SUM", col("total")), "totalIncome"]], raw: true });
    const totalIncome = parseFloat(totalIncomeRow?.totalIncome || 0);

    // new users in same period (based on createdAt if present, otherwise return total users)
    // Models may not have timestamps; fall back to total count
    let newUsers = await Usuario.count();
    if (Usuario.rawAttributes.createdAt && (from || to)) {
      const uwhere = {};
      if (from) uwhere.createdAt = { [Op.gte]: new Date(from) };
      if (to) uwhere.createdAt = { ...(uwhere.createdAt || {}), [Op.lte]: new Date(to) };
      newUsers = await Usuario.count({ where: uwhere });
    }

    res.json({ totalOrders, totalIncome, newUsers });
  } catch (err) {
    console.error("admin summary error:", err.message);
    res.status(500).json({ message: "Error interno" });
  }
};

// New: getStats (alias of getSummary, keeps naming from frontend example)
export const getStats = async (req, res) => {
  // Reuse getSummary logic: call same implementation
  return getSummary(req, res);
};

export const getUsers = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: ["id", "nombre", "correo", "estado", "tipoUsuario"] });
    res.json(usuarios.map(u => u.toJSON()));
  } catch (err) {
    console.error("admin getUsers error:", err.message);
    res.status(500).json({ message: "Error interno" });
  }
};

export const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id, {
      attributes: ["id", "nombre", "apellido", "correo", "direccion", "estado", "tipoUsuario"],
      include: [
        { model: Orden, as: "ordenes", attributes: ["id", "fecha", "total", "estado"] }
      ]
    });
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    const u = usuario.toJSON();
    // normalize field names expected by frontend sample
    const result = {
      id: u.id,
      nombre: `${u.nombre} ${u.apellido || ""}`.trim(),
      correo: u.correo,
      direccion: u.direccion,
      estado: u.estado,
      tipoUsuario: u.tipoUsuario,
      orders: (u.ordenes || []).map(o => ({ id: o.id, fecha: o.fecha, total: o.total, estado: o.estado }))
    };
    res.json(result);
  } catch (err) {
    console.error("admin getUserDetail error:", err.message);
    res.status(500).json({ message: "Error interno" });
  }
};

export const updateUserEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // expected 'activo' or 'inactivo'
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    // Validate estado
    const newEstado = String(estado || '').toLowerCase();
    if (!['activo', 'inactivo'].includes(newEstado)) {
      return res.status(400).json({ message: 'Valor de estado inválido' });
    }
    usuario.estado = newEstado;
    await usuario.save();
    res.json({ id: usuario.id, estado: usuario.estado });
  } catch (err) {
    console.error('admin updateUserEstado error:', err.message);
    res.status(500).json({ message: 'Error interno' });
  }
};

const adminController = { getSummary, getStats, getUsers, getUserDetail, updateUserEstado };
export default adminController;
