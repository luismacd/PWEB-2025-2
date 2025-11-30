import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import CarritoDeCompra from "./CarritoDeCompra.js";
import Producto from "./producto.js";

const ItemDeCarrito = sequelize.define(
  "items_carrito",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// Relaciones
CarritoDeCompra.hasMany(ItemDeCarrito, { foreignKey: "CarritoId" });
ItemDeCarrito.belongsTo(CarritoDeCompra, { foreignKey: "CarritoId" });

Producto.hasMany(ItemDeCarrito, { foreignKey: "ProductoId" });
ItemDeCarrito.belongsTo(Producto, { foreignKey: "ProductoId" });

export default ItemDeCarrito;
