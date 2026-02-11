// src/models/Equipment.js
import { Model, DataTypes } from 'sequelize';

export class Equip extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'name not null'
          },
          len: {
            args: [2, 100],
            msg: 'too short name'
          }
        }
      },
      serial_num: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          name: 'serial_num_unique',
          msg: 'unavailable serial number'
        },
        validate: {
          notEmpty: {
            msg: 'not null'
          }
        }
      },
      client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        validate: {
          notNull: {
            msg: 'not null client'
          }
        }
      }
    }, {
      sequelize,
      modelName: 'Equip',
      tableName: 'equips',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: false,
      indexes: [
        {
          unique: true,
          fields: ['serial_num']
        },
        {
          fields: ['client_id']
        }
      ]
    });
  }

  static associate(models) {
    this.belongsTo(models.Client, {
      foreignKey: 'client_id',
      as: 'client'
    });
  }
}

export default Equip;