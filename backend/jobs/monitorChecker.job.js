import cron from "node-cron";
import axios from "axios";
import { Monitor } from "../models/Monitor.js";

// Ping a single monitor and update its lastStatus + lastChecked
const checkMonitor = async (monitor) => {
    try {
        console.log(now(), "Start checking monitor", monitor.name);
        await axios({
            method: monitor.method || "GET",
            url: monitor.url,
            timeout: (monitor.timeout || 10) * 1000,    // convert seconds → ms
        });
        console.log(now(), "End checking monitor", monitor.name);
        await Monitor.findByIdAndUpdate(monitor._id, {
            lastStatus: "up",
            lastChecked: new Date(),
        });

        console.log(`[Monitor ✅] "${monitor.name}" is UP`);

    } catch {
        await Monitor.findByIdAndUpdate(monitor._id, {
            lastStatus: "down",
            lastChecked: new Date(),
        });

        console.warn(`[Monitor ❌] "${monitor.name}" is DOWN — ${monitor.url}`);

        // TODO: send email alert to monitor.alert_contact
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
