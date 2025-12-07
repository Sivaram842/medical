export default function errorHandler(err, req, res, _next) {
    res.status(err.status || 500).json({ error: { message: err.message || "Server error" } });
}
