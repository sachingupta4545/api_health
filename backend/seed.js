import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { User } from "./models/User.js";
import { Monitor } from "./models/Monitor.js";
import { MonitorLog } from "./models/MonitorLog.js";

const generateLogs = async (monitorId, statusType, baseLatency) => {
    const logs = [];
    const now = new Date();
    // Generate 100 historical logs per monitor to simulate history
    for (let i = 0; i < 100; i++) {
        // Space them by 1 minute
        const time = new Date(now.getTime() - (100 - i) * 60000); 
        let logStatus = 'up';
        let latency = baseLatency + (Math.random() * 50);

        if (statusType === 'outage') {
            logStatus = 'down';
            latency = 5000; 
        } else if (statusType === 'degraded') {
            logStatus = 'up';
            latency = 1500 + (Math.random() * 500); 
            if (Math.random() > 0.9) logStatus = 'down'; // 10% downtime for degraded
        } else if (statusType === 'maintenance') {
            logStatus = 'down'; // MonitorLog only accepts 'up' or 'down'
            latency = 0;
        } else { // operational
            if (Math.random() > 0.98) logStatus = 'down'; // 2% downtime
        }

        logs.push({
            monitorId,
            status: logStatus,
            responseTime: Math.round(latency),
            statusCode: logStatus === 'up' ? 200 : 500,
            errorMessage: logStatus === 'down' ? 'Connection timeout' : null,
            createdAt: time,
            updatedAt: time,
        });
    }
    await MonitorLog.insertMany(logs);
};

const runSeeder = async () => {
    await connectDB();
    
    // Find all users to assign owner rights
    const users = await User.find();
    if (users.length === 0) {
        console.error("Please register at least one user in the application first!");
        process.exit(1);
    }

    const cases = [
        { type: "operational", lastStatus: "up", baseLatency: 85, url: "https://httpstat.us/200" },
        { type: "degraded", lastStatus: "up", baseLatency: 1800, url: "https://httpstat.us/200?sleep=3000" },
        { type: "outage", lastStatus: "down", baseLatency: null, url: "https://httpstat.us/500" },
        { type: "maintenance", lastStatus: "unknown", baseLatency: null, url: "https://httpstat.us/503" },
    ];

    console.log("Seeding dummy data started...");

    for (const user of users) {
        for (const c of cases) {
            for (let i = 1; i <= 5; i++) {
                const name = `Dummy ${c.type.charAt(0).toUpperCase() + c.type.slice(1)} Service ${i}`;
                const monitor = await Monitor.create({
                    name,
                    url: c.url.includes('?') ? `${c.url}&dummy=${i}` : `${c.url}?dummy=${i}`,
                    method: "GET",
                    interval: 60,
                    timeout: 10,
                    alert_contact: user.email,
                    status: "active",
                    lastStatus: c.lastStatus,
                    lastChecked: new Date(),
                    owner: user._id,
                });

                await generateLogs(monitor._id, c.type, c.baseLatency || 0);
                console.log(`Created monitor: ${name} for ${user.email}`);
            }
        }
    }

    console.log(`\nSuccess! Inserted ${20 * users.length} total monitors for ${users.length} users.`);
    process.exit(0);
};

runSeeder().catch(console.error);
