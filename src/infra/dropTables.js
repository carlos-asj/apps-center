import database from "../infra/dbConnectPsql.js";
import { config } from "dotenv";

config();

try {
  const clientsTable = await database.query(`
    DROP TABLE clients CASCADE;`
      );
  console.log("Table clients dropped");

  const equipsTable = await database.query(`
    DROP TABLE equips CASCADE;`
      );
  console.log("Table equips dropped");

  const indexQuery = await database.query(`
    DROP INDEX idx_equips_client_id;
    `);
  console.log("Index dropped");

} catch (error) {
  console.error("error creating tables.", error);
};
