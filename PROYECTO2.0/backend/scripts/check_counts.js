import dotenv from 'dotenv';
dotenv.config();

import sequelize from '../src/config/database.js';
import Usuario from '../src/models/user.js';
import Producto from '../src/models/producto.js';
import Orden from '../src/models/orden.js';

async function run() {
  try {
    await sequelize.authenticate();
    const usuarios = await Usuario.count();
    const productos = await Producto.count();
    const ordenes = await Orden.count();
    console.log(`📊 Counts -> usuarios: ${usuarios}, productos: ${productos}, ordenes: ${ordenes}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error al consultar conteos:', err);
    process.exit(1);
  }
}

run();
