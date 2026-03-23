import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import monitorRoutes from "./routes/monitorRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import { startAllJobs } from "./jobs/index.js";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { monitorQueue } from "./jobs/queues/monitorQueue.js";


const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares ───────────────────────────────────
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

// ─── Connect to Database & Start Jobs ──────────────
await connectDB();
startAllJobs();

// ─── BullBoard (Queue Dashboard) ───────────────────
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
    queues: [new BullMQAdapter(monitorQueue)],
    serverAdapter: serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());


// ─── Routes ────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/monitors", monitorRoutes);
app.use("/api/alerts", alertRoutes);

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