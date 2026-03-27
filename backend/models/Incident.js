import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        monitorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Monitor",
            required: true,
        },
        severity: {
            type: String,
            enum: ["critical", "high", "medium", "low"],
            default: "medium",
        },
        status: {
            type: String,
            enum: ["open", "investigating", "resolved"],
            default: "open",
        },
        startedAt: {
            type: Date,
            default: Date.now,
        },
        resolvedAt: {
            type: Date,
            default: null,
        },
        affectedUrl: {
            type: String,
            trim: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export const Incident = mongoose.model("Incident", incidentSchema);
