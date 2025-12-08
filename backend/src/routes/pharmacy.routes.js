import { Router } from "express";
import auth from "../middlewares/auth.js";
import ownsPharmacy from "../middlewares/ownsPharmacy.js";
import { createPharmacy, myPharmacies, updatePharmacy, deletePharmacy, getPharmacyById } from "../controllers/pharmacy.controller.js";

const router = Router();
router.post("/", auth, createPharmacy);
router.get("/mine", auth, myPharmacies);
router.get("/:pharmacyId", auth, ownsPharmacy, getPharmacyById);        // <-- add this

router.patch("/:pharmacyId", auth, ownsPharmacy, updatePharmacy);
router.delete("/:pharmacyId", auth, ownsPharmacy, deletePharmacy);
export default router;
