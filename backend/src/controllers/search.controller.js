import Medicine from "../models/medicine.model.js";
import Inventory from "../models/inventory.model.js";
import Pharmacy from "../models/pharmacy.model.js";
import { searchSchema, validate } from "../utils/validate.js";

/** escape & build a case-insensitive regex */
const rx = (q) => new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

/** Parse optional query params with safe defaults */
function parseExtras(query, hasLocation) {
    const kind = (query.kind || "all").toLowerCase();
    const sort = (query.sort || (hasLocation ? "distance" : "price")).toLowerCase();
    const page = Math.max(1, parseInt(query.page ?? "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? "20", 10)));
    return { kind, sort, page, limit };
}

/** ---- PHARMACY SEARCH ---- */
async function searchPharmacies({ q, lat, lng, radiusKm, page, limit }) {
    const skip = (page - 1) * limit;

    const match = {
        $or: [
            { name: rx(q) },
            { "address.city": rx(q) },
            { "address.state": rx(q) },
            ...(/^\d+$/.test(q) ? [{ "address.pincode": q }] : [])
        ]
    };

    // With location → use $geoNear for distance + filtering
    if (lat != null && lng != null) {
        const base = [
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [Number(lng), Number(lat)] },
                    distanceField: "distanceMeters",
                    maxDistance: radiusKm * 1000,
                    spherical: true
                }
            },
            { $match: match },
            { $project: { name: 1, address: 1, location: 1, distanceMeters: 1 } }
        ];

        const [items, totalArr] = await Promise.all([
            Pharmacy.aggregate([...base, { $sort: { distanceMeters: 1, name: 1 } }, { $skip: skip }, { $limit: limit }]),
            Pharmacy.aggregate([...base, { $count: "total" }])
        ]);
        const total = totalArr[0]?.total ?? 0;
        return { items, total, page, limit, pages: Math.ceil(total / limit) };
    }

    // No location
    const [items, total] = await Promise.all([
        Pharmacy.find(match).select("_id name address location").sort({ name: 1 }).skip(skip).limit(limit),
        Pharmacy.countDocuments(match)
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
}

/** ---- MEDICINE LISTINGS (medicine + price + stock + pharmacy) ---- */
async function searchMedicineItems({ q, lat, lng, radiusKm, page, limit, sort }) {
    const skip = (page - 1) * limit;

    // Step 1: find medicine ids matching q
    const meds = await Medicine.find({
        $or: [{ name: rx(q) }, { genericName: rx(q) }, { brand: rx(q) }]
    })
        .limit(200) // wide net, we'll paginate at the listing level
        .select("_id name brand strength form genericName");

    const medIds = meds.map((m) => m._id);
    if (medIds.length === 0) {
        return { items: [], total: 0, page, limit, pages: 0 };
    }

    // Step 2: build inventory query (in stock only)
    const invQuery = { medicine: { $in: medIds }, stock: { $gt: 0 } };

    // Location-aware: restrict to nearby pharmacies and sort by distance
    if (lat != null && lng != null) {
        const nearbyPharmacies = await Pharmacy.find({
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
                    $maxDistance: radiusKm * 1000
                }
            }
        }).select("_id name address location");

        const pIds = nearbyPharmacies.map((p) => p._id);
        if (pIds.length === 0) return { items: [], total: 0, page, limit, pages: 0 };

        invQuery.pharmacy = { $in: pIds };

        // distance map for sorting + response
        const distanceMap = new Map();
        // NOTE: $near returns ascending by distance, but it doesn't return numeric distance.
        // We'll approximate by index order if distance not available; if you want exact values,
        // switch to an aggregate with $geoNear. For now, we compute distances using geoNear-like data is not present,
        // so we'll just keep the pharmacy order as "distance rank".
        nearbyPharmacies.forEach((p, idx) => distanceMap.set(String(p._id), idx)); // smaller idx => nearer

        // Fetch all matches (we'll paginate in-memory after sorting by distance/price)
        let items = await Inventory.find(invQuery)
            .populate("medicine", "name brand strength form genericName")
            .populate("pharmacy", "name address location")
            .lean();

        // Attach a pseudo distance rank and sort
        items = items.map((it) => ({
            ...it,
            distanceRank: distanceMap.get(String(it.pharmacy?._id)) ?? Number.MAX_SAFE_INTEGER
        }));

        if (sort === "price") {
            items.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        } else {
            items.sort((a, b) => (a.distanceRank ?? 0) - (b.distanceRank ?? 0));
        }

        const total = items.length;
        const paged = items.slice(skip, skip + limit).map(({ distanceRank, ...rest }) => rest);
        return { items: paged, total, page, limit, pages: Math.ceil(total / limit) };
    }

    // No location: paginate & sort by price (fallback sort)
    const total = await Inventory.countDocuments(invQuery);
    const items = await Inventory.find(invQuery)
        .sort(sort === "price" ? { price: 1 } : { _id: 1 })
        .skip(skip)
        .limit(limit)
        .populate("medicine", "name brand strength form genericName")
        .populate("pharmacy", "name address location")
        .lean();

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
}

/** ---- PUBLIC CONTROLLER (one endpoint for both) ----
 * GET /api/search?q=&lat=&lng=&radiusKm=&kind=&sort=&page=&limit=
 * kind: "medicine" | "pharmacy" | "all" (default "all")
 */
export async function searchMedicines(req, res, next) {
    try {
        // Validate core fields you already had (q, lat, lng, radiusKm)
        const { q, lat, lng, radiusKm } = validate(searchSchema, req.query);
        const hasLocation = lat != null && lng != null;

        // Parse extra params safely without breaking your existing schema
        const { kind, sort, page, limit } = parseExtras(req.query, hasLocation);

        if (kind === "pharmacy") {
            const pharmacies = await searchPharmacies({ q, lat, lng, radiusKm, page, limit });
            return res.json({ kind, ...pharmacies });
        }

        if (kind === "medicine") {
            const listings = await searchMedicineItems({ q, lat, lng, radiusKm, page, limit, sort });
            return res.json({ kind, ...listings });
        }

        // kind === "all" → return a compact summary like Swiggy (top 5 each)
        const compactArgs = { q, lat, lng, radiusKm, page: 1, limit: Math.min(5, limit), sort };
        const [ph, meds] = await Promise.all([
            searchPharmacies(compactArgs),
            searchMedicineItems(compactArgs)
        ]);

        return res.json({
            kind: "all",
            pharmacies: { items: ph.items, total: ph.total },
            medicines: { items: meds.items, total: meds.total }
        });
    } catch (e) {
        next(e);
    }
}
