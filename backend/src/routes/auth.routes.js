import { Router } from "express";
import { signIn, signUp } from "../controllers/auth.controller.js";
import auth from "../middlewares/auth.js";

const router = Router();
router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/me", auth, (req, res) => res.json({ user: req.user }));
export default router;
