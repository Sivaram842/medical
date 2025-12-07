import Medicine from "../models/medicine.model.js";
import { validate, medicineListQuery, medicineCreateSchema } from "../utils/validate.js";

// GET /api/medicines?q=&page=&limit=
export async function listMedicines(req, res, next) {
    try {
        const { q, page, limit } = validate(medicineListQuery, req.query);
        const filter = q
            ? {
                $or: [
                    { name: { $regex: q, $options: "i" } },
                    { genericName: { $regex: q, $options: "i" } },
                    { brand: { $regex: q, $options: "i" } }
                ]
            }
            : {};

        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            Medicine.find(filter).sort({ name: 1 }).skip(skip).limit(limit)
                .select("_id name genericName brand form strength"),
            Medicine.countDocuments(filter)
        ]);

        res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
    } catch (e) { next(e); }
}

// GET /api/medicines/:id
export async function getMedicineById(req, res, next) {
    try {
        const m = await Medicine.findById(req.params.id)
            .select("_id name genericName brand form strength");
        if (!m) { const err = new Error("Medicine not found"); err.status = 404; throw err; }
        res.json({ medicine: m });
    } catch (e) { next(e); }
}

// (Optional) POST /api/medicines  — keep disabled unless you want admin
export async function createMedicine(req, res, next) {
    try {
        const data = validate(medicineCreateSchema, req.body);

        // Trim + normalize optional strings to reduce dupes
        const doc = await Medicine.create({
            name: data.name.trim(),
            genericName: data.genericName?.trim(),
            brand: data.brand?.trim(),
            form: data.form,
            strength: data.strength?.trim(),
            // optional audit fields if you want:
            // createdBy: req.user._id
        });

        res.status(201).json({ medicine: doc });
    } catch (e) {
        // Handle duplicate key nicely
        if (e?.code === 11000) {
            e.status = 409;
            e.message = "Medicine already exists (same name+strength+form+brand)";
        }
        next(e);
    }
}

