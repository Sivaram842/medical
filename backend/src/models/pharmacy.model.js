import mongoose from "mongoose";

const pharmacySchema = new mongoose.Schema(
    {

        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        name: { type: String, required: true, trim: true },
        phone: { type: String, trim: true },
        address: {
            line1: String,
            line2: String,
            city: String,
            state: String,
            pincode: String
        },
        location: {
            type: { type: String, enum: ["Point"], default: "Point" },
            coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
        }
    },
    { timestamps: true }
);
// Put these after schema definition:
pharmacySchema.index({ name: "text", "address.city": "text", "address.state": "text" });
// Quick lookup by pincode too:
pharmacySchema.index({ "address.pincode": 1 });


// Enable geospatial search
pharmacySchema.index({ location: "2dsphere" });

export default mongoose.model("Pharmacy", pharmacySchema);
