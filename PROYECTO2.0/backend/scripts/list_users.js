import dotenv from 'dotenv';
import path from 'path';
// Cargar el .env del backend aunque se ejecute el script desde la raíz del repo
dotenv.config({ path: path.join(process.cwd(), 'backend', '.env') });

import sequelize from '../src/config/database.js';
import Usuario from '../src/models/user.js';

async function run() {
  try {
    await sequelize.authenticate();
    const users = await Usuario.findAll();
    console.log(JSON.stringify(users.map(u => u.toJSON()), null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error list_users:', err);
    process.exit(1);
  }
}

run();
