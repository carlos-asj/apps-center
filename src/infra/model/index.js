// models-v2/index.js - NOVO SISTEMA
import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    dialect: 'postgres',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

export const Client = sequelize.define('Client', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cpf_cnpj: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'clients',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  validate: false
});

export const Equip = sequelize.define('Equip', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  serial_num: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  client_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'equips',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  validate: false
});

Client.hasMany(Equip, {
  foreignKey: 'client_id',
  as: 'equips'
});

Equip.belongsTo(Client, {
  foreignKey: 'client_id',
  as: 'client'
});

export async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com PostgreSQL estabelecida');
    
    // Sincronizar sem forçar
    await sequelize.sync({ 
      force: false,
      alter: false,
      logging: console.log
    });
    
    console.log('✅ Tabelas sincronizadas');
    return true;
    
  } catch (error) {
    console.error('❌ Erro na inicialização:', error.message);
    throw error;
  }
};