import cron from "node-cron";
import axios from "axios";
import { Monitor } from "../models/Monitor.js";
import { MonitorLog } from "../models/MonitorLog.js";
// Ping a single monitor and update its lastStatus + lastChecked
const checkMonitor = async (monitor) => {
    const start = Date.now();   // declared outside try so catch can access it

    try {
        const response = await axios({
            method: monitor.method || "GET",
            url: monitor.url,
            timeout: (monitor.timeout || 10) * 1000,    // convert seconds → ms
        });

        await MonitorLog.create({
            monitorId: monitor._id,
            status: "up",
            statusCode: response.status,        // real status code, not hardcoded 200
            responseTime: Date.now() - start,   // no need for separate `end` variable
            message: `[Monitor ✅] "${monitor.name}" is UP `,
        });

        await Monitor.findByIdAndUpdate(monitor._id, {
            lastStatus: "up",
            lastChecked: new Date(),
        });

        console.log(`[Monitor ✅] "${monitor.name}" is UP (${response.status})`);

    } catch (error) {

        await MonitorLog.create({
            monitorId: monitor._id,
            status: "down",
            statusCode: error.response?.status ?? 0,    // real code if server replied, 0 if timeout
            responseTime: Date.now() - start,           // start is accessible here now ✅
            message: error.message,
        });

        await Monitor.findByIdAndUpdate(monitor._id, {
            lastStatus: "down",
            lastChecked: new Date(),
        });

        console.warn(`[Monitor ❌] "${monitor.name}" is DOWN — ${error.message}`);
    }
};

// Run every minute — checks all active monitors
export const startMonitorChecker = () => {
    let isRunning = false;

    cron.schedule("* * * * *", async () => {
        if (isRunning) {
            console.warn("Cron previous run still in progress, skipping...");
            return;
        }

        isRunning = true;
        try {
            const monitors = await Monitor.find({ status: "active" }); // get all active monitors
            await Promise.allSettled(monitors.map(checkMonitor)); // run all checks concurrently
        } catch (error) {
            console.error("Cron Error:", error.message);
        } finally {
            isRunning = false;   // always release the flag, even if it throws
        }
    });


    console.log(" Cron Monitor checker started — running every minute");
};
