import dotenv from 'dotenv';
dotenv.config();

import sequelize from '../src/config/database.js';
import Usuario from '../src/models/user.js';
import bcrypt from 'bcrypt';

async function run() {
  try {
    await sequelize.authenticate();
    const users = await Usuario.findAll();
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    for (const u of users) {
      const pw = u.password || '';
      if (!pw.startsWith('$2')) {
        const hashed = await bcrypt.hash(pw, saltRounds);
        u.password = hashed;
        await u.save();
        console.log(`Hasheada contraseña para: ${u.correo}`);
      }
    }
    console.log('Proceso completado.');
    process.exit(0);
  } catch (err) {
    console.error('Error hash_existing_passwords:', err);
    process.exit(1);
  }
}

run();
