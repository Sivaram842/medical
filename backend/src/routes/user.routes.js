import { Router } from "express";
import auth from "../middlewares/auth.js";
import { getMe, updateMe, changePassword, deleteMe } from "../controllers/user.controller.js";

const router = Router();

router.get("/me", auth, getMe);
router.patch("/me", auth, updateMe);
router.patch("/me/password", auth, changePassword);
router.delete("/me", auth, deleteMe);

export default router;
