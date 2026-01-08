import express from "express";
import usersRoutes from "./routes/user.js";
import healthRoutes from "./routes/health.js";
import cors from "cors";
import helmet from "helmet";
import initDatabase from "./infra/database/database.js";

const app = express();
const PORT = 3000;

async function startServer() {
  try {
    await initDatabase();

    app.use(helmet({
        contentSecurityPolicy: {
        directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "http://localhost:*"],
        },
        },
    }));

    app.use(cors());
    app.use(express.json()); // basically convert things to json

    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });

    console.log("HTTP Server is running")

    app.use("/health", healthRoutes);
    app.use("/users", usersRoutes);

    app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

  } catch (error) {
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: "Something went wrong!" });
    });
    console.error(`Falha ao iniciar o servidor: ${error.message}`);
    process.exit(1);
  }
}

startServer();