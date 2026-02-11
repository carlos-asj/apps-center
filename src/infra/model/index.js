// src/models/index.js
import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import Client from './Client.js';
import Equip from './Equip.js';

config();

export async function setupDatabase() {
  const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        underscored: true,
        timestamps: true
      }
    }
  );

  // Inicializar modelos
  Client.init(sequelize);
  Equip.init(sequelize);

  // Definir associações
  Client.associate({ Equip });
  Equip.associate({ Client });

  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection established');
    
    await sequelize.sync({ force: false, alter: true });
    console.log('Models sync with db');
    
    return sequelize;
  } catch (error) {
    console.error('Error to db sync:', error.message);
    throw error;
  }
}

// Exportar modelos para uso em outros arquivos
export { Client, Equip };