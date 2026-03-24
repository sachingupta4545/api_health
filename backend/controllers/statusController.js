import { Monitor } from "../models/Monitor.js";
import { MonitorLog } from "../models/MonitorLog.js";

// @desc    Get dynamic status page data for all monitors
// @route   GET /api/status
// @access  Private
export const getStatusPageData = async (req, res) => {
    try {
        const monitors = await Monitor.find({ owner: req.user._id }).sort({ createdAt: -1 });
        
        const services = await Promise.all(monitors.map(async (monitor) => {
            const logs = await MonitorLog.find({ monitorId: monitor._id }).sort({ createdAt: -1 }).limit(100);
            
            const totalChecks = logs.length;
            const upChecks = logs.filter((l) => l.status === "up").length;
            const uptimePercent = totalChecks === 0 ? "—" : ((upChecks / totalChecks) * 100).toFixed(2) + "%";
            
            const avgResponseTime = totalChecks === 0 
                ? "—" 
                : Math.round(logs.reduce((sum, l) => sum + l.responseTime, 0) / totalChecks) + "ms";
            
            let status = "maintenance"; // default if unknown
            if (monitor.lastStatus === "up") status = "operational";
            if (monitor.lastStatus === "down") status = "outage";
            
            return {
                name: monitor.name,
                status: status,
                uptime: uptimePercent,
                responseTime: avgResponseTime,
                description: monitor.url, // using URL as description for now
            };
        }));
        
        // Group all monitors into one group for now since Monitor doesn't have a group concept
        const groupings = [
            {
                group: "Monitored Services",
                services: services
            }
        ];

        res.status(200).json({ groups: groupings });
    } catch (error) {
        console.error("getStatusPageData Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
