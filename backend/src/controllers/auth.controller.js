import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { validate, signInSchema, signUpSchema } from "../utils/validate.js";

const signToken = (u) =>
    jwt.sign({ sub: u._id, email: u.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

export async function signUp(req, res, next) {
    try {
        const { name, email, password } = validate(signUpSchema, req.body);
        const exists = await User.findOne({ email });
        if (exists) { const e = new Error("Email already in use"); e.status = 409; throw e; }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, passwordHash });
        const token = signToken(user);
        res.status(201).json({ user: { id: user._id, name, email }, token });
    } catch (err) { next(err); }
}

export async function signIn(req, res, next) {
    try {
        const { email, password } = validate(signInSchema, req.body);
        const user = await User.findOne({ email });
        if (!user) { const e = new Error("Invalid credentials"); e.status = 401; throw e; }
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) { const e = new Error("Invalid credentials"); e.status = 401; throw e; }
        const token = signToken(user);
        res.json({ user: { id: user._id, name: user.name, email }, token });
    } catch (err) { next(err); }
}
