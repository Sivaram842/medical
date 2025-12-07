import { Router } from "express";
import auth from "../middlewares/auth.js";
import ownsPharmacy from "../middlewares/ownsPharmacy.js";
import { upsertInventory, listInventory, deleteInventoryItem } from "../controllers/inventory.controller.js";

const router = Router();

// owner-only: must pass auth + ownsPharmacy (checks :pharmacyId belongs to user)
router.put("/:pharmacyId", auth, ownsPharmacy, upsertInventory);
router.get("/:pharmacyId", auth, ownsPharmacy, listInventory);
router.delete("/:pharmacyId/:inventoryId", auth, ownsPharmacy, deleteInventoryItem);

export default router;
