import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../src/db.js";
import Medicine from "../src/models/medicine.model.js";

await connectDB();
await Medicine.deleteMany({});
await Medicine.insertMany([
    { name: "Paracetamol", brand: "Calpol", strength: "500mg", form: "tablet", genericName: "Acetaminophen" },
    { name: "Ibuprofen", brand: "Brufen", strength: "400mg", form: "tablet", genericName: "Ibuprofen" },
    { name: "Cetrizine", brand: "Cetcip", strength: "10mg", form: "tablet", genericName: "Cetirizine" },
    { name: "Amoxicillin", genericName: "Amoxicillin", brand: "Amoxil", strength: "500mg", form: "capsule" },
    { name: "Azithromycin", genericName: "Azithromycin", brand: "Zithromax", strength: "500mg", form: "tablet" },
    { name: "ORS", genericName: "Oral Rehydration Salts", brand: "Electral", form: "syrup" }

]);
console.log("Seeded medicines");
await mongoose.connection.close();
