import { z } from "zod";

export const updateUserSchema = z.object({
    name: z.string().min(2).max(60).optional()
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6)
});
export const pharmacyCreateSchema = z.object({
    name: z.string().min(2),
    phone: z.string().optional(),
    address: z.object({
        line1: z.string().optional(),
        line2: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        pincode: z.string().optional()
    }).optional(),
    // lat/lng as numbers for geolocation
    lat: z.number(),
    lng: z.number()
});
export const pharmacyUpdateSchema = z.object({
    name: z.string().min(2).optional(),
    phone: z.string().optional(),
    address: z.object({
        line1: z.string().optional(),
        line2: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        pincode: z.string().optional()
    }).optional(),
    lat: z.number().optional(),
    lng: z.number().optional()
});

export const inventoryUpsertSchema = z.object({
    medicineId: z.string().min(1),
    price: z.number().positive(),
    stock: z.number().int().min(0)
});

export const inventoryListQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20)
});
export const searchSchema = z.object({
    q: z.string().min(1),      // medicine name
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
    radiusKm: z.coerce.number().min(1).max(50).default(10),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    sort: z.enum(["distance", "price"]).default("distance"),
    // NEW: decide what to return
    kind: z.enum(["medicine", "pharmacy", "all"]).default("all")
});

export const signUpSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6)
});
export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});
export function validate(schema, data) {
    const out = schema.safeParse(data);
    if (!out.success) {
        const msg = out.error.issues.map(i => i.message).join(", ");
        const err = new Error(msg); err.status = 400; throw err;
    }
    return out.data;
}
// public list/search
export const medicineListQuery = z.object({
    q: z.string().trim().optional(),          // search term
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20)
});

// (Optional) admin create schema if you ever want POST /medicines
export const medicineCreateSchema = z.object({
    name: z.string().min(1),
    genericName: z.string().optional(),
    brand: z.string().optional(),
    form: z.enum(["tablet", "capsule", "syrup", "injection", "other"]).optional(),
    strength: z.string().optional()
});
