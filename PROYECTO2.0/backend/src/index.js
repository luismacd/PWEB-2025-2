import dotenv from "dotenv";
import path from "path";
import { spawn } from "child_process";

// Load environment variables from the backend/.env file (repo root may be different)
dotenv.config({ path: path.join(process.cwd(), "backend", ".env") });

// Import app and sequelize dynamically after dotenv has been applied so
// all modules see the populated process.env (important for PORT, JWT_SECRET, etc.)

let app;
let sequelize;
async function runSeedScript() {
  return new Promise((resolve, reject) => {
    // Resolve the seed script path relative to repository root (process.cwd())
    const seedFile = path.join(process.cwd(), "backend", "scripts", "checkTables.js");
    const child = spawn(process.execPath, [seedFile], { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Seed script exited with code ${code}`));
    });
    child.on("error", (err) => reject(err));
  });
}

async function main() {
  try {
    // Import app and sequelize now that env vars are loaded
    app = (await import("./app.js")).default;
    sequelize = (await import("./config/database.js")).default;

    const init = process.argv[2];

    if (init) await sequelize.sync({ force: true });
    else await sequelize.sync({ force: false });

    console.log("Base de datos sincronizada!");

    // Ejecutar script de seed SOLO si SEED_ON_START está explicitamente a 'true'
    // Esto evita ejecutar el seed automáticamente en desarrollo por defecto.
    const seedEnv = process.env.SEED_ON_START;
    const shouldSeed = seedEnv === "true";

    if (shouldSeed) {
      try {
        console.log("Ejecutando seed: scripts/checkTables.cjs...");
        await runSeedScript();
        console.log("Seed finalizado.");
      } catch (err) {
        console.error("Error al ejecutar seed:", err);
      }
    }

    const port = process.env.PORT || 3005;
    app.listen(port, () => {
      console.log("Server running on port " + port);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
