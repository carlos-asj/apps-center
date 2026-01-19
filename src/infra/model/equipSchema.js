import { DataTypes } from "sequelize";

export const createEquipModel = async (sequelize) => {
  
  const Equip = sequelize.define('equipamentos', {
    equip_id: {
        type: DataTypes.BIGINT,
        primaryKey: true
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
    http: {
      type: DataTypes.STRING,
      allowNull: false,
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
    }
  });

  return Equip;

};