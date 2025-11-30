#!/usr/bin/env node
import { spawnSync } from 'child_process';
import path from 'path';
import dotenv from 'dotenv';

// Load .env from current working directory (backend folder when run via npm start)
dotenv.config({ path: path.join(process.cwd(), '.env') });

const SKIP_SEED = process.env.SKIP_SEED === 'true' || process.env.SKIP_SEED === '1';
const RUN_SEED = !SKIP_SEED;

function runSeed() {
  console.log('Running seed script (recreate_and_seed.js)');
  const seedPath = path.join(process.cwd(), 'scripts', 'recreate_and_seed.js');
  const res = spawnSync(process.execPath, [seedPath], { stdio: 'inherit' });
  return res.status === 0;
}

function startServer() {
  console.log('Starting backend server (src/index.js)');
  const child = spawnSync(process.execPath, [path.join(process.cwd(), 'src', 'index.js')], { stdio: 'inherit' });
  process.exit(child.status);
}

(async ()=>{
  try {
    if (RUN_SEED) {
      const ok = runSeed();
      if (!ok) {
        console.warn('Seed script exited with non-zero status. Continuing to start server.');
      }
    } else {
      console.log('SKIP_SEED is set — not running seed.');
    }
    startServer();
  } catch (err) {
    console.error('start_with_seed error:', err);
    process.exit(1);
  }
})();
