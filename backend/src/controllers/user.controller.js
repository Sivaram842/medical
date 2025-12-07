import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { validate, updateUserSchema, changePasswordSchema } from "../utils/validate.js";

// GET /api/users/me  (We also have /api/auth/me; this returns same but from user routes)
export async function getMe(req, res, next) {
    try {
        const user = await User.findById(req.user._id).select("_id name email role createdAt updatedAt");
        res.json({ user });
    } catch (e) { next(e); }
}

// PATCH /api/users/me
export async function updateMe(req, res, next) {
    try {
        const data = validate(updateUserSchema, req.body);
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: data },
            { new: true, runValidators: true, select: "_id name email role createdAt updatedAt" }
        );
        res.json({ user });
    } catch (e) { next(e); }
}

// PATCH /api/users/me/password
export async function changePassword(req, res, next) {
    try {
        const { currentPassword, newPassword } = validate(changePasswordSchema, req.body);
        const user = await User.findById(req.user._id).select("passwordHash");
        const ok = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!ok) { const err = new Error("Current password is incorrect"); err.status = 400; throw err; }
        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: "Password updated" });
    } catch (e) { next(e); }
}

// DELETE /api/users/me
export async function deleteMe(req, res, next) {
    try {
        await User.findByIdAndDelete(req.user._id);
        res.status(204).send(); // No Content
    } catch (e) { next(e); }
}
