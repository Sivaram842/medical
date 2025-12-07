import mongoose from "mongoose";

export default async function connectDB() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI missing in .env");
    try {
        await mongoose.connect(uri, { dbName: "app" });
        console.log("MongoDB connected");
    } catch (e) {
        console.error("MongoDB connection error:", e.message);
        process.exit(1);
    }
}
