// setup-database.js
import pkg from 'pg';
import { config } from 'dotenv';

config();
const { Client } = pkg; //

async function setupDatabase() {
  console.log('📋 DB config:');
  console.log(`   Host: ${process.env.DB_HOST}`);
  console.log(`   Port: ${process.env.DB_PORT}`);
  console.log(`   DB: ${process.env.DB_NAME}`);
  console.log(`   User: ${process.env.DB_USER}`);
  console.log(`   Password: ${process.env.DB_PASSWORD}`);

  // Usar valores padrão se necessário
  const DB_HOST = process.env.DB_HOST;
  const DB_PORT = process.env.DB_PORT;
  const DB_NAME = process.env.DB_NAME;
  const DB_USER = process.env.DB_USER;
  const DB_PASSWORD = process.env.DB_PASSWORD;
  const POSTGRES_PASSWORD = process.env.DB_PASSWORD;

  const adminClient = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: 'postgres',
    password: POSTGRES_PASSWORD
  });

  try {
    await adminClient.connect();
    console.log('Conecting to PostgreSQL\n');

    // 2. Criar usuário
    console.log('Creating user');
    try {
      await adminClient.query(`
        CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}'
      `);
      console.log(`✅ Usuário '${DB_USER}' criado`);
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`✅ Usuário '${DB_USER}' já existe`);
      } else {
        console.log(`⚠️  ${error.message}`);
      }
    }

    // 3. Criar banco
    console.log('\nCreating users');
    try {
      await adminClient.query(`
        CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}
      `);
      console.log(`✅ Banco '${DB_NAME}' criado`);
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`✅ Banco '${DB_NAME}' já existe`);
      } else {
        console.log(`⚠️  ${error.message}`);
      }
    }

    // 4. Conceder permissões
    console.log('\nGrating permissions');
    try {
      await adminClient.query(`
        GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER}
      `);
      console.log('Permissions granted');
    } catch (error) {
      console.log(`⚠️  ${error.message}`);
    }

    await adminClient.end();

    // 5. Conectar como usuário da aplicação
    console.log('\nConecting to the application');
    
    const appClient = new Client({
      host: DB_HOST,
      port: DB_PORT,
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD
    });

    try {
      await appClient.connect();

      // 6. Criar tabelas
      console.log('Creating tables');

      // Tabela customers
      await appClient.query(`
        CREATE TABLE IF NOT EXISTS clients (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          cpf_cnpj VARCHAR(18) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Table "clients" created');

      // Tabela equipments
      await appClient.query(`
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
        )
      `);
      console.log('✅ Table "equips" created');

      // Índice
      await appClient.query(`
        CREATE INDEX IF NOT EXISTS idx_equips_client_id 
        ON equips(client_id)
      `);
      console.log('Index created');

      await appClient.end();

    } catch (error) {
      console.log(`⚠️  Erro ao conectar como usuário da aplicação: ${error.message}`);
      console.log('💡 As tabelas serão criadas quando a aplicação iniciar.');
    }

  } catch (error) {
    console.error(`\n❌ ERRO: ${error.message}`);
    
    console.log('\n🔧 SOLUÇÃO MANUAL:');
    console.log('=================\n');
    console.log('1. No pgAdmin ou linha de comando, execute:');
    console.log('');
    console.log(`   CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';`);
    console.log(`   CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};`);
    console.log(`   GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};`);
    console.log('');
    console.log('2. Depois execute: npm start');
  }
}

setupDatabase();