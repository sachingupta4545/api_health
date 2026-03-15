import cron from "node-cron";
import { Monitor } from "../models/Monitor.js";
import { monitorQueue } from "./queues/monitorQueue.js";

// Run every minute — only enqueue monitors whose check interval has elapsed
export const startMonitorChecker = () => {
    let isRunning = false;

    cron.schedule("0 * * * * *", async () => {   // fires at second 0 of every minute
        if (isRunning) {
            console.warn("[Cron] Previous run still in progress, skipping...");
            return;
        }

        isRunning = true;
        try {
            const now = Date.now();
            const monitors = await Monitor.find({ status: "active" });

            for (const monitor of monitors) {
                const lastChecked = monitor.lastChecked?.getTime() ?? 0;
                const elapsed = now - lastChecked;

                // Only enqueue if enough time has passed since the last check
                if (elapsed < monitor.interval * 1000) continue;

                monitorQueue.add(
                    "check-monitor",
                    { monitorId: monitor._id },
                    {
                        attempts: 3,
                        backoff: { type: "exponential", delay: 1000 },
                        removeOnComplete: { age: 3600, count: 1000 },
                        removeOnFail: { age: 24 * 3600 },
                    }
                );
            }
        } catch (error) {
            console.error("[Cron] Error:", error.message);
        } finally {
            isRunning = false;
        }
    });

    console.log("[Cron] Monitor checker started — running every minute");
};
