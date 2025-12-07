import "dotenv/config";
import app from "./app.js";
import connectDB from "./db.js";

const port = process.env.PORT || 4000;
await connectDB(); // ensure DB first
app.listen(port, () => console.log(`API → http://localhost:${port}`));
