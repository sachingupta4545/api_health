import mongoose from "mongoose";

const monitorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Monitor name is required"],
            trim: true,
        },
        url: {
            type: String,
            required: [true, "URL is required"],
            trim: true,
        },
        method: {
            type: String,
            enum: ["GET", "POST", "PUT", "DELETE", "HEAD"],
            default: "GET",
        },
        interval: {
            type: Number,
            default: 60,                          // seconds between checks
            min: [10, "Interval must be at least 10 seconds"],
        },
        timeout: {
            type: Number,
            default: 10,                          // seconds before request is aborted
            min: [1, "Timeout must be at least 1 second"],
        },
        alert_contact: {
            type: String,
            trim: true,
            lowercase: true,
        },
        status: {
            type: String,
            enum: ["active", "paused"],
            default: "active",
        },
        // ─── Written by the cron job ───────────────
        lastStatus: {
            type: String,
            enum: ["up", "down", "unknown"],
            default: "unknown",
        },
        lastChecked: {
            type: Date,
            default: null,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export const Monitor = mongoose.model("Monitor", monitorSchema);
