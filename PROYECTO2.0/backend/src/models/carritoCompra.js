import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./user.js";

const CarritoDeCompra = sequelize.define(
  "carritos",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// Relación
// Un usuario tiene UN carrito
Usuario.hasOne(CarritoDeCompra, {
  foreignKey: "idUsuario",
});

CarritoDeCompra.belongsTo(Usuario, {
  foreignKey: "idUsuario",
});

export default CarritoDeCompra;
