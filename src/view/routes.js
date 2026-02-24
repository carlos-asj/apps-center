import express from "express";
import {
  addClient,
  getAllClients,
  getClientId,
  deleteClient,
  addEquip,
  getAllEquip,
  getEquipId,
  updateEquip,
  deleteEquip,
  status
} from "./controller/controller.js";

const router = express.Router();

router.get("/equips", getAllEquip);
router.get("/equip/:equipId", getEquipId);
router.get("/clients", getAllClients);
router.get("/client/:clientId", getClientId);

router.post("/equips", addEquip);
router.post("/clients", addClient);

router.put("/equip/:equipId", updateEquip);
//router.put("/client/:clientId", updateClient);

router.delete("/clients/:clientId", deleteClient);
router.delete("/equips/:equipId", deleteEquip);

router.get("/status", status);

export default router;
