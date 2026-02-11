import { Model, DataTypes } from 'sequelize';

export class Client extends Model {
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
            args: [3, 100],
            msg: 'too short name'
          }
        }
      },
      cpf_cnpj: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: 'not null'
          },
          len: {
            args: [11, 18],
            msg: 'unavailable'
          }
        }
      }
    }, {
      sequelize,
      modelName: 'Client',
      tableName: 'clients',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: false
    });
  }

  /**
   * Define as associações do modelo
   */
  static associate(models) {
    this.hasMany(models.Equip, {
      foreignKey: 'client_id',
      as: 'equips'
    });
  }
}

export default Client;