import express from "express";
import { addEquip, getAllEquip, getEquipId } from "../controller/equipController.js";

const router = express.Router();

router.get("/equips", getAllEquip);
router.get("/equips/:id", getEquipId);
router.post("/equip", addEquip)

export default router;