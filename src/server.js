
import startApp from "./app.js";
import initDatabase from "./infra/database/database.js";

async function startServer() {
  try {
    await initDatabase();
    await startApp();

  } catch (error) {
    console.error(`Falha ao iniciar o servidor: ${error.message}`);
    process.exit(1);
  }
}

startServer();