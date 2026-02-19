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

} catch (error) {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  });
}
