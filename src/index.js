import express from "express";
import "dotenv/config";
import router from "./view/routes.js";
import cors from "cors";

const PORT = process.env.PORT;
const app = express();

app.use(cors())
app.use(express.json());

try {
  app.use(router);
  console.log("HTTP Server is running");

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log(`Access http://localhost:${PORT}\n`);
  });

} catch (error) {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  });
}
