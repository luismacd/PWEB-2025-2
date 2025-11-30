import dotenv from 'dotenv';
dotenv.config();

import sequelize from '../src/config/database.js';
import Usuario from '../src/models/user.js';

async function run() {
  try {
    await sequelize.authenticate();
    const user = await Usuario.findOne({ where: { correo: 'admin@dashboard.com' } });
    console.log(JSON.stringify(user?.toJSON?.() || null, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error debug_user:', err);
    process.exit(1);
  }
}

run();
