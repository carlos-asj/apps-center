import express from "express";
import "dotenv/config";
import { connection } from "./infra/database.js";
import router from "./view/routes.js";

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

try {
  app.use(router);
  console.log("HTTP Server is running");

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });

  connection();
} catch (error) {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  });
}
