import express from "express";
import {
  addEquip,
  getAllEquip,
  getEquipId,
  updateEquip,
  deleteEquip,
} from "../controller/equipController.js";
import {
  addCliente,
  getAllClientes,
  getCliente,
} from "../controller/clientesController.js";

const router = express.Router();

router.get("/equips", getAllEquip);
router.get("/equips/:equip_id", getEquipId);
router.get("/clientes", getAllClientes);
router.get("/clientes/:cliente_id", getCliente);

router.post("/equip", addEquip);
router.post("/cliente", addCliente);

router.put("/equip/:equip_id", updateEquip);

router.delete("/equip/:equip_id", deleteEquip);

export default router;
