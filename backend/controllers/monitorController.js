import { Monitor } from "../models/Monitor.js";
import { MonitorLog } from "../models/MonitorLog.js";

// @desc    Create a new monitor
// @route   POST /api/monitors
// @access  Private
export const createMonitor = async (req, res) => {
    try {
        const { name, url, method, interval, timeout, alert_contact, status } = req.body;

        const monitor = await Monitor.create({
            name,
            url,
            method,
            interval,
            timeout,
            alert_contact,
            status,
            owner: req.user._id,
        });

        res.status(201).json({ message: "Monitor created", monitor });
    } catch (error) {
        console.error("createMonitor Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Get all monitors for the logged-in user
// @route   GET /api/monitors
// @access  Private
export const getMonitors = async (req, res) => {
    try {
        const monitors = await Monitor.find({ owner: req.user._id }).sort({ createdAt: -1 });
        console.log(monitors);
        res.status(200).json({ count: monitors.length, monitors });
    } catch (error) {
        console.error("getMonitors Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Get a single monitor by ID
// @route   GET /api/monitors/:id
// @access  Private
export const getMonitorById = async (req, res) => {
    try {
        const monitor = await Monitor.findOne({ _id: req.params.id, owner: req.user._id });

        if (!monitor) {
            return res.status(404).json({ message: "Monitor not found" });
        }

        res.status(200).json({ monitor });
    } catch (error) {
        console.error("getMonitorById Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Update a monitor
// @route   PUT /api/monitors/:id
// @access  Private
export const updateMonitor = async (req, res) => {
    try {
        const { name, url, method, interval, timeout, alert_contact, status } = req.body;

        const monitor = await Monitor.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id },   // only owner can update
            { name, url, method, interval, timeout, alert_contact, status },
            { new: true, runValidators: true }
        );

        if (!monitor) {
            return res.status(404).json({ message: "Monitor not found" });
        }

        res.status(200).json({ message: "Monitor updated", monitor });
    } catch (error) {
        console.error("updateMonitor Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Delete a monitor
// @route   DELETE /api/monitors/:id
// @access  Private
export const deleteMonitor = async (req, res) => {
    try {
        const monitor = await Monitor.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id,   // only owner can delete
        });

        if (!monitor) {
            return res.status(404).json({ message: "Monitor not found" });
        }

        res.status(200).json({ message: "Monitor deleted" });
    } catch (error) {
        console.error("deleteMonitor Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Get paginated logs for a monitor
// @route   GET /api/monitors/:id/logs?page=1&limit=50
// @access  Private
export const getMonitorLogs = async (req, res) => {
    try {
        const monitor = await Monitor.findOne({ _id: req.params.id, owner: req.user._id });
        if (!monitor) {
            return res.status(404).json({ message: "Monitor not found" });
        }

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, parseInt(req.query.limit) || 50);
        const skip = (page - 1) * limit;

        const [logs, total] = await Promise.all([
            MonitorLog.find({ monitorId: req.params.id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            MonitorLog.countDocuments({ monitorId: req.params.id }),
        ]);

        res.status(200).json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            logs,
        });
    } catch (error) {
        console.error("getMonitorLogs Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Get uptime stats for a monitor
// @route   GET /api/monitors/:id/stats
// @access  Private
export const getMonitorStats = async (req, res) => {
    try {
        const monitor = await Monitor.findOne({ _id: req.params.id, owner: req.user._id });
        if (!monitor) {
            return res.status(404).json({ message: "Monitor not found" });
        }

        const logs = await MonitorLog.find({ monitorId: req.params.id });

        const totalChecks = logs.length;
        const upChecks = logs.filter((l) => l.status === "up").length;
        const uptimePercent = totalChecks === 0 ? null : ((upChecks / totalChecks) * 100).toFixed(2);
        const avgResponseTime = totalChecks === 0
            ? null
            : Math.round(logs.reduce((sum, l) => sum + l.responseTime, 0) / totalChecks);

        res.status(200).json({
            totalChecks,
            uptimePercent: uptimePercent !== null ? Number(uptimePercent) : null,
            avgResponseTime,
        });
    } catch (error) {
        console.error("getMonitorStats Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Get dashboard metrics
// @route   GET /api/monitors/dashboard
// @access  Private
export const getDashboardMetrics = async (req, res) => {
    try {
        const monitors = await Monitor.find({ owner: req.user._id });
        const totalMonitors = monitors.length;
        const upMonitors = monitors.filter(m => m.lastStatus === "up").length;
        const downMonitors = monitors.filter(m => m.lastStatus === "down").length;
        
        const monitorIds = monitors.map(m => m._id);

        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const hourlyAggregation = await MonitorLog.aggregate([
            { 
                $match: { 
                    monitorId: { $in: monitorIds },
                    createdAt: { $gte: twentyFourHoursAgo } 
                } 
            },
            {
                $group: {
                    _id: { $hour: "$createdAt" },
                    avgResponseTime: { $avg: "$responseTime" },
                    responses: { $push: "$responseTime" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        let avgResponseTime = 0;
        if (hourlyAggregation.length > 0) {
            avgResponseTime = Math.round(
                hourlyAggregation.reduce((acc, curr) => acc + curr.avgResponseTime, 0) / hourlyAggregation.length
            );
        }

        const responseTimeChartMap = new Map();
        hourlyAggregation.forEach(group => {
            const hour = group._id;
            const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
            
            const sorted = group.responses.sort((a, b) => a - b);
            const avg = Math.round(group.avgResponseTime);
            const p95 = sorted[Math.floor(sorted.length * 0.95)] || avg;
            const p99 = sorted[Math.floor(sorted.length * 0.99)] || p95;
            
            responseTimeChartMap.set(timeLabel, { time: timeLabel, avg, p95, p99 });
        });

        const responseTimeChart = Array.from(responseTimeChartMap.values());
        if (responseTimeChart.length === 0) {
            const currentHour = new Date().getHours();
            responseTimeChart.push({ time: `${currentHour.toString().padStart(2, '0')}:00`, avg: 0, p95: 0, p99: 0 });
        }

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyAggregation = await MonitorLog.aggregate([
            { 
                $match: { 
                    monitorId: { $in: monitorIds },
                    createdAt: { $gte: sevenDaysAgo } 
                } 
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" }
                    },
                    total: { $sum: 1 },
                    up: { $sum: { $cond: [{ $eq: ["$status", "up"] }, 1, 0] } }
                }
            }
        ]);

        const uptimeChartMap = new Map();
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            uptimeChartMap.set(dateStr, { date: dateStr, total: 0, up: 0 });
        }

        dailyAggregation.forEach(group => {
            const d = new Date(group._id.year, group._id.month - 1, group._id.day);
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (uptimeChartMap.has(dateStr)) {
                const entry = uptimeChartMap.get(dateStr);
                entry.total += group.total;
                entry.up += group.up;
            }
        });

        const uptimeChart = Array.from(uptimeChartMap.values()).map(entry => {
            const percent = entry.total === 0 ? 100 : Math.round((entry.up / entry.total) * 100);
            return { date: entry.date, percent };
        });

        res.status(200).json({
            stats: { totalMonitors, upMonitors, downMonitors, avgResponseTime },
            charts: { responseTimeChart, uptimeChart }
        });
    } catch (error) {
        console.error("getDashboardMetrics Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
