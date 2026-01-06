import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import usersRoutes from "./routes/user.js";
import healthRoutes from "./routes/health.js";
import cors from "cors";
import helmet from "helmet";

dotenv.config();

const app = express();
const PORT = 3000;

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
app.use("/health", healthRoutes);

// USERS
app.use("/users", usersRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});