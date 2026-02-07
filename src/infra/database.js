import pkg from 'pg';
import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync, writeFileSync } from 'fs';

const { Client } = pkg;

const envPath = resolve(process.cwd(), '.env');

async function seedDB() {

console.log(`HOST: ${process.env.DB_HOST}
  PORT: ${process.env.DB_PORT}
  DB: ${process.env.DB_NAME}
  USER: ${process.env.DB_USER}
  PASSWORD: ${process.env.DB_PASSWORD}`);


if(!existsSync(envPath)) {
  console.log('.env archive not found');
} else {
  console.log('.env archive found ->', envPath);
};

config({ path: envPath });

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const POSTGRES_PASSWORD = process.env.DB_PASSWORD;

const adminClient = new Client({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: POSTGRES_PASSWORD
});

try {
  await adminClient.connect();
  console.log('Conected to db\n');

  try {
    await adminClient.query(`CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}'`);
    console.log(`User created! ${DB_USER}\n`);
  } catch(error) {
    console.log(error.message);
  }

  try {
    await adminClient.query(`CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}`)
    console.log(`Database created! ${DB_NAME}\n`);
  } catch (error) {
    console.log(error.message);
  };

  try {
    await adminClient.query(`GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER}`)
    console.log('Permissions granted\n');
  } catch (error) {
    console.log(error.message);
  };

  await adminClient.end();

  const appClient = new Client({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD
  });

  console.log('Creating tables');

  try {
    await appClient.connect();

    console.log('creating clients table');
    await appClient.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        cpf_cnpj VARCHAR(18) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('creating equips table');
    await appClient.query(`
      CREATE TABLE IF NOT EXISTS equips (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        serial_num VARCHAR(255) UNIQUE,
        local_ip VARCHAR(12),
        http_port INTEGER,
        rtsp_port INTEGER,
        link_rtsp VARCHAR(255),
        client_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_client
          FOREIGN KEY (client_id) 
          REFERENCES clients(id)
      );
    `);

    console.log('Tables created!\n');

    await appClient.query(`
      CREATE INDEX IF NOT EXISTS idx_equip_client_id
      ON equips(client_id);
    `);
    console.log('Index created!\n');

    await appClient.end();
    
  } catch (error) {
    console.log(error.message);
  }

  } catch (error) {
    console.log(`\nERRO: ${error.message}`);
  };
};

seedDB();