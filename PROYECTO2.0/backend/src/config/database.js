import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Usar variable de entorno `DATABASE_URL` si está disponible
const CADENA_CONEXION =
  process.env.DATABASE_URL ||
  "postgres://postgres:asuna%403101@localhost:5432/postgres";

const sequelize = new Sequelize(CADENA_CONEXION, {
  logging: false, // desactiva logs de SQL en consola
});

export default sequelize;

