import { Incident } from "../models/Incident.js";

// @desc    Get all incidents for the logged-in user
// @route   GET /api/incidents
// @access  Private
export const getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find({ owner: req.user._id })
            .populate("monitorId", "name url")
            .sort({ startedAt: -1 });
        res.status(200).json({ count: incidents.length, incidents });
    } catch (error) {
        console.error("getIncidents Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Get a single incident by ID
// @route   GET /api/incidents/:id
// @access  Private
export const getIncidentById = async (req, res) => {
    try {
        const incident = await Incident.findOne({ _id: req.params.id, owner: req.user._id })
            .populate("monitorId", "name url");

        if (!incident) {
            return res.status(404).json({ message: "Incident not found" });
        }

        res.status(200).json({ incident });
    } catch (error) {
        console.error("getIncidentById Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Create a new incident (manual)
// @route   POST /api/incidents
// @access  Private
export const createIncident = async (req, res) => {
    try {
        const { title, monitorId, severity, status, affectedUrl, startedAt, description, affectedServices, timeline } = req.body;

        // generate a unique ID, e.g., INC-timestamp
        const id = `INC-${Date.now()}`;

        const incident = await Incident.create({
            id,
            title,
            monitorId,
            severity,
            status,
            affectedUrl,
            startedAt: startedAt || Date.now(),
            description: description || '',
            affectedServices: affectedServices || [],
            timeline: timeline || [],
            owner: req.user._id,
        });

        res.status(201).json({ message: "Incident created", incident });
    } catch (error) {
        console.error("createIncident Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Update an incident
// @route   PUT /api/incidents/:id
// @access  Private
export const updateIncident = async (req, res) => {
    try {
        const { title, severity, status, resolvedAt, description, affectedServices, timeline } = req.body;

        // if resolved, set resolvedAt if not provided
        let finalResolvedAt = resolvedAt;
        if (status === "resolved" && !finalResolvedAt) {
            finalResolvedAt = new Date();
        } else if (status !== "resolved") {
            finalResolvedAt = null;
        }

        const updateFields = { title, severity, status, resolvedAt: finalResolvedAt };
        if (description !== undefined) updateFields.description = description;
        if (affectedServices !== undefined) updateFields.affectedServices = affectedServices;
        if (timeline !== undefined) updateFields.timeline = timeline;

        const incident = await Incident.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id },
            updateFields,
            { new: true, runValidators: true }
        ).populate("monitorId", "name url");

        if (!incident) {
            return res.status(404).json({ message: "Incident not found" });
        }

        res.status(200).json({ message: "Incident updated", incident });
    } catch (error) {
        console.error("updateIncident Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Delete an incident
// @route   DELETE /api/incidents/:id
// @access  Private
export const deleteIncident = async (req, res) => {
    try {
        const incident = await Incident.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!incident) {
            return res.status(404).json({ message: "Incident not found" });
        }

        res.status(200).json({ message: "Incident deleted" });
    } catch (error) {
        console.error("deleteIncident Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
