import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middlewares/error.js";
import pharmacyRoutes from "./routes/pharmacy.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import searchRoutes from "./routes/search.routes.js";
import userRoutes from "./routes/user.routes.js";
import medicineRoutes from "./routes/medicine.routes.js";


const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => res.json({ ok: true })); // quick check
app.use("/api/auth", authRoutes);                       // routes

app.use(errorHandler);                                  // last


app.use("/api/pharmacies", pharmacyRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/users", userRoutes);
app.use("/api/medicines", medicineRoutes);

export default app;
