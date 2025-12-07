export default function isAdmin(req, _res, next) {
    if (req.user?.role !== "admin") {
        const e = new Error("Forbidden");
        e.status = 403;
        throw e;
    }
    next();
}
