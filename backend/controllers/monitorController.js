import { Monitor } from "../models/Monitor.js";

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

        res.status(200).json({ count: monitors.length, monitors });
    } catch (error) {
        console.error("getMonitors Error:", error.message);
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
            owner: req.user._id,                            // only owner can delete
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
