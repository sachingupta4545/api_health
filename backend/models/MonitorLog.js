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
    },
});
export const MonitorLog = mongoose.model("MonitorLog", monitorLogSchema);