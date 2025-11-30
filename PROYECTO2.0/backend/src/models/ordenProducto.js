import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Orden from "./orden.js";
import Producto from "./producto.js";


const OrdenProducto = sequelize.define("ordenes_productos", {
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  precioUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true
});

// Relaciones muchos a muchos
Orden.belongsToMany(Producto, { through: OrdenProducto, foreignKey: "ordenId", as: "productos" });
Producto.belongsToMany(Orden, { through: OrdenProducto, foreignKey: "productoId", as: "ordenes" });

export default OrdenProducto;
