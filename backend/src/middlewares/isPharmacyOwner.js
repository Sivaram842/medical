import Pharmacy from "../models/pharmacy.model.js";

export default async function isPharmacyOwner(req, _res, next) {
    try {
        const hasOne = await Pharmacy.exists({ owner: req.user._id });
        if (!hasOne) {
            const e = new Error("You must own a pharmacy to perform this action");
            e.status = 403;
            throw e;
        }
        next();
    } catch (e) { next(e); }
}
