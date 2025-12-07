import Pharmacy from "../models/pharmacy.model.js";

/**
 * Ensures the authenticated user owns the pharmacy in :pharmacyId
 * Use after `auth` middleware.
 */
export default async function ownsPharmacy(req, _res, next) {
    try {
        const { pharmacyId } = req.params;
        const p = await Pharmacy.findOne({ _id: pharmacyId, owner: req.user._id }).select("_id");
        if (!p) { const e = new Error("Pharmacy not found or not yours"); e.status = 404; throw e; }
        next();
    } catch (e) { next(e); }
}
