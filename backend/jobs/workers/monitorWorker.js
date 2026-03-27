import { Worker } from "bullmq";
import { redisConnection } from "../../config/redis.js";
import { processor } from "../processors/monitorProcessor.js";  // ← imported, not inline

// ─── Worker — listens to Redis queue ─────────────────────
export const startMonitorWorker = () => {
    const worker = new Worker("monitors", processor, {
        connection: redisConnection,
        concurrency: 5,   // process up to 5 monitors at the same time
    });

    worker.on("completed", (job) => {
        console.log(`[Worker] Job ${job.id} completed`);
    });

    worker.on("failed", (job, error) => {
        console.error(`[Worker] Job ${job.id} failed (attempt ${job.attemptsMade}): ${error.message}`);
    });

    console.log("[Worker] Monitor worker started");
    return worker;
};
