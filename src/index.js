import express from "express";
import "dotenv/config";
import router from "./view/routes.js";
import { setupDatabase } from "./infra/model/index.js";

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

try {
  app.use(router);
  console.log("HTTP Server is running");

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });

  async function startServer() {
    try {
      // Conectar ao banco de dados
      await setupDatabase();
      
      // Iniciar servidor
      app.listen(PORT, () => {
        console.log('\n✨ Servidor iniciado com sucesso!');
        console.log(`📡 URL: http://localhost:${PORT}`);
        console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
        console.log(`🗄️  Banco: ${process.env.DB_NAME}`);
        console.log('\n🛣️  Rotas disponíveis:');
        console.log(`   GET  http://localhost:${PORT}/equips`);
        console.log(`   GET  http://localhost:${PORT}/clients`);
        console.log(`   POST http://localhost:${PORT}/equips`);
        console.log(`   POST http://localhost:${PORT}/clients`);
        console.log('\n⚡ Use Ctrl+C para parar o servidor\n');
      });
    } catch (error) {
      console.error('❌ Falha ao iniciar o servidor:', error.message);
      process.exit(1);
    }
  }

  startServer();
} catch (error) {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  });
}
