import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Producto = sequelize.define("productos", {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  presentacion: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  categoria: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  precio: {
  type: DataTypes.FLOAT,
  allowNull: false,
  defaultValue: 0
  }
  ,
  imagen: {
    type: DataTypes.STRING,
    allowNull: true
  }
  ,
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  timestamps: false,
  freezeTableName: true
});

export default Producto
