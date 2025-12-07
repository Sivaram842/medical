import Inventory from "../models/inventory.model.js";
import Medicine from "../models/medicine.model.js";
import Pharmacy from "../models/pharmacy.model.js";
import { inventoryUpsertSchema, validate, inventoryListQuery } from "../utils/validate.js";

export async function upsertInventory(req, res, next) {
    try {
        const { medicineId, price, stock } = validate(inventoryUpsertSchema, req.body);
        // ensure user owns this pharmacy
        const pharmacyId = req.params.pharmacyId;
        const pharmacy = await Pharmacy.findOne({ _id: pharmacyId, owner: req.user._id });
        if (!pharmacy) { const e = new Error("Pharmacy not found or not yours"); e.status = 404; throw e; }


        // ensure medicine exists
        const med = await Medicine.findById(medicineId).select("_id");
        if (!med) { const e = new Error("Medicine not found"); e.status = 404; throw e; }


        const doc = await Inventory.findOneAndUpdate(
            { pharmacy: pharmacyId, medicine: medicineId },
            { $set: { price, stock } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // populate for nicer response
        await doc.populate([
            { path: "medicine", select: "name brand genericName form strength" },
            { path: "pharmacy", select: "name address" }
        ]);

        res.json({ inventory: doc });
    } catch (e) {
        if (e?.code === 11000) { e.status = 409; e.message = "Inventory already exists"; }
        next(e);
    }
}


/**
 * GET /api/inventory/:pharmacyId
 * List inventory for a pharmacy you own
 */
export async function listInventory(req, res, next) {
    try {
        const { page, limit } = validate(inventoryListQuery, req.query);
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            Inventory.find({ pharmacy: req.params.pharmacyId })
                .populate("medicine", "name brand genericName form strength")
                .sort("-updatedAt")
                .skip(skip)
                .limit(limit),
            Inventory.countDocuments({ pharmacy: req.params.pharmacyId })
        ]);

        res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
    } catch (e) { next(e); }
}

/**
 * DELETE /api/inventory/:pharmacyId/:inventoryId
 * Remove one inventory item (owner only)
 */
export async function deleteInventoryItem(req, res, next) {
    try {
        const { pharmacyId, inventoryId } = req.params;
        const deleted = await Inventory.findOneAndDelete({ _id: inventoryId, pharmacy: pharmacyId });
        if (!deleted) { const e = new Error("Inventory item not found"); e.status = 404; throw e; }
        res.status(204).send();
    } catch (e) { next(e); }
}