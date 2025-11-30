import Orden from "../models/orden.js";
import Usuario from "../models/user.js";
import Producto from "../models/producto.js";
import OrdenProducto from "../models/ordenProducto.js";

export const createOrden = async (req, res) => {
  try {
    const { usuarioId, productos } = req.body; 
    // productos = [{ productoId, cantidad, precioUnitario }]
    const orden = await Orden.create({ usuarioId, total: 0 });

    let total = 0;
    for (const p of productos) {
      await OrdenProducto.create({
        ordenId: orden.id,
        productoId: p.productoId,
        cantidad: p.cantidad,
        precioUnitario: p.precioUnitario
      });
      total += p.cantidad * p.precioUnitario;
    }

    orden.total = total;
    await orden.save();

    res.status(201).json(orden);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.findAll({
      include: [
        { model: Usuario, as: "usuario" },
        { model: Producto, as: "productos" }
      ]
    });
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMisOrdenes = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return res.status(400).json({ message: "User id not found in token" });

    const ordenes = await Orden.findAll({
      where: { usuarioId: userId },
      include: [
        { model: Usuario, as: "usuario" },
        { model: Producto, as: "productos" }
      ]
    });

    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrdenById = async (req, res) => {
  try {
    const { id } = req.params;
    const orden = await Orden.findByPk(id, {
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Producto, as: 'productos', through: { attributes: ['cantidad', 'precioUnitario'] } }
      ]
    });
    if (!orden) return res.status(404).json({ message: 'Orden no encontrada' });
    res.json(orden);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const ordenController = { getOrdenes, createOrden, getMisOrdenes, getOrdenById };
export default ordenController;