import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
    {
        pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: "Pharmacy", required: true, index: true },
        medicine: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true, index: true },
        price: { type: Number, required: true },
        stock: { type: Number, default: 0 }
    },
    { timestamps: true }
);

// prevent duplicate (same medicine listed twice by the same pharmacy)
inventorySchema.index({ pharmacy: 1, medicine: 1 }, { unique: true });

export default mongoose.model("Inventory", inventorySchema);
