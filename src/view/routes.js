import express from "express";
import {
  addClient,
  getAllClients,
  getClient,
  addEquip,
  getAllEquip,
  getEquipId,
  updateEquip,
  deleteEquip,
  status
} from "./controller/controller.js";

const router = express.Router();

router.get("/equips", getAllEquip);
router.get("/equips/:equip_id", getEquipId);
router.get("/clients", getAllClients);
router.get("/clients/:client_id", getClient);

router.post("/equips", addEquip);
router.post("/clients", addClient);

router.put("/equip/:equip_id", updateEquip);

router.delete("/equip/:equip_id", deleteEquip);

router.get("/status", status);

export default router;
