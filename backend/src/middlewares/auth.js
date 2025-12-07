import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export default async function auth(req, res, next) {
    try {
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ") ? header.slice(7) : null;
        if (!token) { const e = new Error("Unauthorized"); e.status = 401; throw e; }
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.sub).select("_id name email");
        if (!user) { const e = new Error("Unauthorized"); e.status = 401; throw e; }
        req.user = user;
        next();
    } catch (err) { err.status = err.status || 401; next(err); }
}
