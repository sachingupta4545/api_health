import { Worker } from "bullmq";
import axios from "axios";
import https from "https";
import { Monitor } from "../../models/Monitor.js";
import { MonitorLog } from "../../models/MonitorLog.js";
import { redisConnection } from "../../config/redis.js";

// Skip SSL cert verification — uptime monitors check reachability, not cert validity
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// ─── Processor — runs for every job the worker picks up ──
const processor = async (job) => {
    const { monitorId } = job.data;

    const monitor = await Monitor.findById(monitorId);
    if (!monitor) throw new Error(`Monitor ${monitorId} not found`);

    const start = Date.now();

    try {
        const response = await axios({
            method: monitor.method || "GET",
            url: monitor.url,
            timeout: (monitor.timeout || 10) * 1000,
            httpsAgent,   // skip SSL cert verification
        });

        await MonitorLog.create({
            monitorId: monitor._id,
            status: "up",
            statusCode: response.status,
            responseTime: Date.now() - start,
            message: `UP`,
        });

        await Monitor.findByIdAndUpdate(monitor._id, {
            lastStatus: "up",
            lastChecked: new Date(),
        });

        console.log(`[Worker ✅] "${monitor.name}" is UP (${response.status}) — ${Date.now() - start}ms`);

    } catch (error) {
        await MonitorLog.create({
            monitorId: monitor._id,
            status: "down",
            statusCode: error.response?.status ?? 0,
            responseTime: Date.now() - start,
            message: error.message,
        });

        await Monitor.findByIdAndUpdate(monitor._id, {
            lastStatus: "down",
            lastChecked: new Date(),
        });

        console.warn(`[Worker ❌] "${monitor.name}" is DOWN — ${error.message}`);
        throw error;   // re-throw so BullMQ knows it failed and can retry
    }
};

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
