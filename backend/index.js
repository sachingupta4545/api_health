import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import monitorRoutes from "./routes/monitorRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares ───────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Connect to Database ────────────────────────────
await connectDB();

// ─── Routes ────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/monitors", monitorRoutes);

// ─── Health Check ───────────────────────────────────
app.get("/", (req, res) => {
    res.json({ status: "OK", message: "API Health Check Server is running" });
});

// ─── Global Error Handler ────────────────────────────
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.message);
    res.status(500).json({ message: err.message });
});

// ─── Start Server ────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});