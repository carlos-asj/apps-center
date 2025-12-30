import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Users from "./infra/models/user/Users.js";
import { createUserController } from "./infra/services/controllers/userController.js";
import { userValidation } from "./infra/validator/userValidator.js";
import login from "./infra/services/login/userLogin.js";
import database from "./infra/postgres/database.js"

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json()); // basically convert things to json

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to database connect");
  }
};

connectMongoDB();

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
})

// HEALTHY CHECK
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  })
})

app.get("/health/postgres", async (req, res) => {
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

// CREATE
app.post("/users", userValidation, createUserController);

// READ
app.get("/users", async (req, res) => {
  try {
    const allUsers = await Users.find();
    res.json(allUsers);
  } catch (error) {
    res.json({ error: error });
  }
});

// UPDATE
app.put("/users/:id", async (req, res) => {
  try {
    const emailData = req.body.email;

    if (!emailData || !emailData.includes("@")) {
      console.log("E-mail incorreto!");
      return res.status(400).json({
        error: "E-mail incorreto!"
      })
    }

    const udpateUser = await Users.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(201).json(udpateUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/users/login", login)

// DELETE
app.delete("/users/:id", async (req, res) => {
  try {
    

  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});