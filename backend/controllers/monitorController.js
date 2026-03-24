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
