import { Alert } from "../models/Alert.js";
import { Monitor } from "../models/Monitor.js";

// @desc    Create a new alert rule
// @route   POST /api/alerts
// @access  Private
export const createAlert = async (req, res) => {
    try {
        const { name, monitor, condition, threshold, status_pattern, emails, enabled } = req.body;

        // Check if monitor exists and belongs to user
        const monitorExists = await Monitor.findOne({ _id: monitor, owner: req.user._id });
        if (!monitorExists) {
            return res.status(404).json({ message: "Monitor not found" });
        }

        const alert = await Alert.create({
            name,
            monitor,
            condition,
            threshold,
            status_pattern,
            emails,
            enabled,
            owner: req.user._id,
        });

        res.status(201).json({ message: "Alert rule created", alert });
    } catch (error) {
        console.error("createAlert Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Get all alert rules for the logged-in user
// @route   GET /api/alerts
// @access  Private
export const getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({ owner: req.user._id })
            .populate("monitor", "name url")
            .sort({ createdAt: -1 });

        res.status(200).json({ count: alerts.length, alerts });
    } catch (error) {
        console.error("getAlerts Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Get a single alert rule by ID
// @route   GET /api/alerts/:id
// @access  Private
export const getAlertById = async (req, res) => {
    try {
        const alert = await Alert.findOne({ _id: req.params.id, owner: req.user._id })
            .populate("monitor", "name url");

        if (!alert) {
            return res.status(404).json({ message: "Alert rule not found" });
        }

        res.status(200).json({ alert });
    } catch (error) {
        console.error("getAlertById Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Update an alert rule
// @route   PUT /api/alerts/:id
// @access  Private
export const updateAlert = async (req, res) => {
    try {
        const { name, monitor, condition, threshold, status_pattern, emails, enabled } = req.body;

        // If monitor is being changed, check if new monitor exists and belongs to user
        if (monitor) {
            const monitorExists = await Monitor.findOne({ _id: monitor, owner: req.user._id });
            if (!monitorExists) {
                return res.status(404).json({ message: "Monitor not found" });
            }
        }

        const alert = await Alert.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id },
            { name, monitor, condition, threshold, status_pattern, emails, enabled },
            { new: true, runValidators: true }
        ).populate("monitor", "name url");

        if (!alert) {
            return res.status(404).json({ message: "Alert rule not found" });
        }

        res.status(200).json({ message: "Alert rule updated", alert });
    } catch (error) {
        console.error("updateAlert Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Delete an alert rule
// @route   DELETE /api/alerts/:id
// @access  Private
export const deleteAlert = async (req, res) => {
    try {
        const alert = await Alert.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!alert) {
            return res.status(404).json({ message: "Alert rule not found" });
        }

        res.status(200).json({ message: "Alert rule deleted" });
    } catch (error) {
        console.error("deleteAlert Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
