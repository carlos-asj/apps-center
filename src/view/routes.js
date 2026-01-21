import express from "express";
import { addEquip, getAllEquip, getEquipId, updateEquip, deleteEquip, addCliente } from "../controller/equipController.js";

const router = express.Router();

router.get("/equips", getAllEquip);
router.get("/equips/:equip_id", getEquipId);

router.post("/equip", addEquip);
router.post("/cliente", addCliente)

router.put("/equip/:equip_id", updateEquip);

router.delete("/equip/:equip_id", deleteEquip);

export default router;