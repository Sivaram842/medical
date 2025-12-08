import { Router } from "express";
import { searchMedicines } from "../controllers/search.controller.js";

const router = Router();
router.get("/search", searchMedicines);
export default router;
