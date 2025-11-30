import { Op } from "sequelize";
import Producto from "../models/producto.js";

export const createProducto = async (req, res) => {
  try {
    const nuevoProducto = await Producto.create(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductos = async (req, res) => {
  try {
    const { page = 1, limit = 20, q, categoria, sortBy } = req.query;
    const where = {};
    // By default only return active products; admin can pass includeInactive=true
    // Only add the activo filter if the model actually has that attribute
    const hasActivo = Producto.rawAttributes && Object.prototype.hasOwnProperty.call(Producto.rawAttributes, 'activo');
    if (hasActivo) {
      if (!(req.query && String(req.query.includeInactive) === 'true')) {
        where.activo = true;
      }
    }
    if (q) {
      where[Op.or] = [
        { nombre: { [Op.iLike]: `%${q}%` } },
        { presentacion: { [Op.iLike]: `%${q}%` } },
        { descripcion: { [Op.iLike]: `%${q}%` } }
      ];
    }
    if (categoria) where.categoria = categoria;

    const order = [];
    if (sortBy === "precio") order.push(["precio", "ASC"]);
    else if (sortBy === "nombre") order.push(["nombre", "ASC"]);
    else if (sortBy === "recientes") {
      // If model has timestamps use createdAt, otherwise fallback to id DESC
      if (Producto.rawAttributes && Object.prototype.hasOwnProperty.call(Producto.rawAttributes, 'createdAt')) {
        order.push(['createdAt', 'DESC']);
      } else {
        // fallback: order by id desc (UUIDs don't strictly sort by creation time but it's a best-effort)
        order.push(['id', 'DESC']);
      }
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    try {
      const { rows, count } = await Producto.findAndCountAll({ where, order, limit: parseInt(limit), offset });
      return res.json({ productos: rows, total: count });
    } catch (err) {
      // If DB schema doesn't have `activo` column, retry without that filter
      const msg = (err && err.message) || '';
      if (/(activo does not exist|column .*\.activo does not exist|column\s+"?activo"?\s+does not exist)/i.test(msg)) {
        // remove activo filter and retry
        if (Object.prototype.hasOwnProperty.call(where, 'activo')) delete where.activo;
        const { rows, count } = await Producto.findAndCountAll({ where, order, limit: parseInt(limit), offset });
        return res.json({ productos: rows, total: count });
      }
      throw err;
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    await producto.update(req.body);
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    await producto.destroy();
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const productoController = { getProductos, createProducto, getProductoById, updateProducto, deleteProducto };
export default productoController;
