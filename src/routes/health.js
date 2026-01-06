import express from "express";
import mongoose from "mongoose";
import database from "../infra/postgres/database.js";

const healthRoutes = express.Router();

healthRoutes.get('/', async (req, res) => {
    try {
        const updatedAt = new Date().toISOString();

        res.status(200).json({
            status: "healty",
            updated_at: updatedAt,
            database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
        });
    } catch (error) {
        res.status(503).json({
            updated_at: updatedAt,
            status: "unhealthy"
        });
    };
});

healthRoutes.get('/postgres', async (req, res) => {
    const updatedAt = new Date().toISOString();
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseName = process.env.POSTGRES_DB;
  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1",
    values: [databaseName],
  });

  const databaseOpenedConnectionsValue = databaseOpenedConnectionsResult.rows[0].count;

  try {
    res.status(200).json({
      updated_at: updatedAt,
      status: "healthy",
      database_name: databaseName,
      dependencies: {
        version: databaseVersionValue,
        max_connections: databaseMaxConnectionsValue,
        opened_connections: databaseOpenedConnectionsValue
      }
    });
  } catch (error) {
    res.status(503).json({
      updated_at: updatedAt,
      status: "unhealthy"
    });
  }
});

export default healthRoutes;