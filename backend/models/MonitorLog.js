import mongoose from "mongoose";

const monitorLogSchema = new mongoose.Schema({
    monitorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Monitor",
        required: true,
    },
    status: {
        type: String,
        enum: ["up", "down"],
        required: true,
    },
    statusCode: {
        type: Number,
        required: true,
    },
    responseTime: {
        type: Number,
        required: true,
    },
    message: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: "30d" },  // TTL — MongoDB auto-deletes logs older than 30 days
    },
});

// Compound index for fast log queries: find logs for a monitor sorted by newest first
monitorLogSchema.index({ monitorId: 1, createdAt: -1 });

export const MonitorLog = mongoose.model("MonitorLog", monitorLogSchema);