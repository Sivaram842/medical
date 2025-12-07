import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, index: true },
        brand: { type: String, trim: true, index: true },
        form: { type: String, enum: ["tablet", "capsule", "syrup", "injection", "other"], default: "other" },
        strength: { type: String, trim: true }, // e.g., "500mg"
        genericName: { type: String, trim: true, index: true }
    },
    { timestamps: true }
);

medicineSchema.index({ name: "text", genericName: "text", brand: "text" });

// 🔒 Prevent duplicates by (name+strength+form+brand) case-insensitively
medicineSchema.index(
    { name: 1, strength: 1, form: 1, brand: 1 },
    { unique: true, collation: { locale: "en", strength: 2 } } // strength:2 => case-insensitive
);

export default mongoose.model("Medicine", medicineSchema);
