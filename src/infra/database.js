import { Sequelize } from "sequelize";
import { createEquipModel } from "./model/equipSchema.js";

const sequelize = new Sequelize('local_db', 'local_user', 'local_password', {
  host: 'localhost',
  dialect: 'postgres'
});

let EquipModel = null;

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been estabilished successfully.');
    EquipModel = await createEquipModel(sequelize)
    await sequelize.sync();
    console.log("Database Synced");
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  };
};

export {
  connection,
  EquipModel
}