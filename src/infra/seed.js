import database from "../infra/dbConnectPsql.js";
import { config } from "dotenv";

config();

try {
  const clientsTable = await database.query(`
    CREATE TABLE IF NOT EXISTS clients (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          cpf_cnpj VARCHAR(18) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`
      );
  console.log("Table clients created");

  const equipsTable = await database.query(`
    CREATE TABLE IF NOT EXISTS equips (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          serial_num VARCHAR(255) UNIQUE NOT NULL,
          client_id INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_client
            FOREIGN KEY (client_id) 
            REFERENCES clients(id)
        );`
      );
  console.log("Table equips created");

  const indexQuery = await database.query(`
    CREATE INDEX IF NOT EXISTS idx_equips_client_id 
    ON equips(client_id)
    `);
  console.log("Index created");

  const clients = await database.query(`
    SELECT * FROM clients;
  `);

  console.log("Clients: ", clients.rows);
  console.log("Clients: ", clientsTable.rows);
  console.log("Equips: ", equipsTable.rows)

} catch (error) {
  console.error("error creating tables.", error);
};
