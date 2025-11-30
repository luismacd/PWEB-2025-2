import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Usuario = sequelize.define("usuarios", {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  apellido: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  dni: {
    type: DataTypes.INTEGER(8),
    allowNull: true,
    unique: true
  },
  direccion: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  ciudad: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  correo: {
    type: DataTypes.STRING(40),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  tipoUsuario: {
    type: DataTypes.ENUM("admin", "usuario"),
    allowNull: false,
    defaultValue: "usuario"
  },
  estado: {
    type: DataTypes.ENUM("activo", "inactivo"),
    allowNull: false,
    defaultValue: "activo"
  }
}, {
  timestamps: false,
  freezeTableName: true
});

export default Usuario;
