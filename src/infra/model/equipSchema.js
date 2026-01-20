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
    },
    imagem_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imagem_nome: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imagem_mimetype: {
      type: DataTypes.STRING,
      allowNull: true
    },
    thumbnail_url: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return Equip;

};