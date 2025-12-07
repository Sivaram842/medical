import { Router } from "express";
import { listMedicines, getMedicineById, createMedicine } from "../controllers/medicine.controller.js";
import auth from "../middlewares/auth.js";
import isPharmacyOwner from "../middlewares/isPharmacyOwner.js";
// import auth from "../middlewares/auth.js";
// import isAdmin from "../middlewares/isAdmin.js";

const router = Router();

router.get("/", listMedicines);
router.get("/:id", getMedicineById);

// Enable later if you want to add via API:
// router.post("/", auth, isAdmin, createMedicine);
// ✨ Owner-only create
router.post("/", auth, isPharmacyOwner, createMedicine);
export default router;
