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
        interval: {
            type: Number,
            default: 60,                          // seconds between checks
            min: [10, "Interval must be at least 10 seconds"],
        },
        status: {
            type: String,
            enum: ["active", "paused"],
            default: "active",
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
