import "dotenv/config";
import { connectDB } from "./config/db.js";
import { startMonitorWorker } from "./jobs/workers/monitorWorker.js";

// ─── Standalone Worker Process ────────────────────────────────
// Run this separately from the main API server:
//   node worker.js   (or)   npm run worker
//
// Multiple instances can run simultaneously — BullMQ + Redis
// coordinate job distribution so no job is processed twice.

await connectDB();

const worker = startMonitorWorker();

// Graceful shutdown — finish in-progress jobs before exiting
const shutdown = async () => {
    console.log("[Worker] Shutting down gracefully...");
    await worker.close();
    process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
