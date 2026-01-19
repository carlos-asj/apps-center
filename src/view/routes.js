import express from "express";
import { getAllEquip } from "../controller/equipController.js";

const router = express.Router();

router.get("/equips", getAllEquip);

export default router;