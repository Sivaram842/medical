import Pharmacy from "../models/pharmacy.model.js";
import { pharmacyCreateSchema, validate, pharmacyUpdateSchema } from "../utils/validate.js";

export async function createPharmacy(req, res, next) {
    try {
        const data = validate(pharmacyCreateSchema, req.body);
        const doc = await Pharmacy.create({
            owner: req.user._id,
            name: data.name,
            phone: data.phone,
            address: data.address,
            location: { type: "Point", coordinates: [data.lng, data.lat] }
        });
        res.status(201).json({ pharmacy: doc });
    } catch (e) { next(e); }
}

export async function myPharmacies(req, res, next) {
    try {
        const list = await Pharmacy.find({ owner: req.user._id });
        res.json({ pharmacies: list });
    } catch (e) { next(e); }
}

// PATCH /api/pharmacies/:pharmacyId
export async function updatePharmacy(req, res, next) {
    try {
        const data = validate(pharmacyUpdateSchema, req.body);
        const update = {
            ...(data.name ? { name: data.name } : {}),
            ...(data.phone ? { phone: data.phone } : {}),
            ...(data.address ? { address: data.address } : {}),
            ...((data.lat != null && data.lng != null)
                ? { location: { type: "Point", coordinates: [data.lng, data.lat] } }
                : {})
        };

        const doc = await Pharmacy.findOneAndUpdate(
            { _id: req.params.pharmacyId, owner: req.user._id },
            { $set: update },
            { new: true }
        );
        if (!doc) { const e = new Error("Pharmacy not found or not yours"); e.status = 404; throw e; }
        res.json({ pharmacy: doc });
    } catch (e) { next(e); }
}

// DELETE /api/pharmacies/:pharmacyId
export async function deletePharmacy(req, res, next) {
    try {
        const doc = await Pharmacy.findOneAndDelete({ _id: req.params.pharmacyId, owner: req.user._id });
        if (!doc) { const e = new Error("Pharmacy not found or not yours"); e.status = 404; throw e; }
        res.status(204).send();
    } catch (e) { next(e); }
}

// GET /api/pharmacies/:pharmacyId
export async function getPharmacyById(req, res, next) {
    try {
        const { pharmacyId } = req.params;

        // If this endpoint should be public to any logged-in user:
        const doc = await Pharmacy.findById(pharmacyId);

        // If it should be owner-only, use this instead:
        // const doc = await Pharmacy.findOne({ _id: pharmacyId, owner: req.user._id });

        if (!doc) {
            const e = new Error("Pharmacy not found");
            e.status = 404;
            throw e;
        }
        res.json({ pharmacy: doc });
    } catch (e) { next(e); }
}
