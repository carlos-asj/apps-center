import { DataTypes } from "sequelize";

export const createEquipModel = async (sequelize) => {
  
  const Equip = sequelize.define('equipamentos', {
    equip_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    http: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    rtsp: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    mac: {
      type: DataTypes.STRING,
      allowNull: false
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link_rtsp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    NS: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Equip;
};

export const createClientesModel = async (sequelize) => {
  const Clientes = sequelize.define('clientes', {
    cliente_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    localizacao: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoria: {
      type: DataTypes.ENUM('App', 'Torre', 'PegLev', 'Outro'),
      defaultValue: 'Nenhum',
      allowNull: false,
    }
  });

  return Clientes;
};