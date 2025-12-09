import express from "express";

const router = express.Router();
const PY_GIS_BASE_URL = process.env.PY_GIS_BASE_URL || "http://localhost:5001";

router.get("/hospitals", async (req, res) => {
    try {
        const { lat, lng, radius_km } = req.query;
        if (!lat || !lng) return res.status(400).json({ error: "lat and lng are required" });

        const qs = new URLSearchParams({
            lat: String(lat),
            lng: String(lng),
            ...(radius_km ? { radius_km: String(radius_km) } : {})
        });

        const resp = await fetch(`${PY_GIS_BASE_URL}/hospitals?${qs}`);
        const data = await resp.json();
        res.json(data);
    } catch (err) {
        console.error("GIS proxy error:", err);
        res.status(500).json({ error: "Failed to fetch GIS data" });
    }
});

export default router;
