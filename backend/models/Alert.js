import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Alert name is required"],
            trim: true,
        },
        monitor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Monitor",
            required: [true, "Monitor reference is required"],
        },
        condition: {
            type: String,
            enum: ["down", "slow", "ssl_expiry", "status_code"],
            required: [true, "Alert condition is required"],
        },
        threshold: {
            type: Number,
            default: 3000, // milliseconds for slow, days for ssl_expiry
        },
        status_pattern: {
            type: String,
            trim: true,
            default: ">= 500",
        },
        emails: {
            type: [String],
            required: [true, "Recipient emails are required"],
            validate: {
                validator: function (v) {
                    return v.length > 0;
                },
                message: "At least one email is required",
            },
        },
        enabled: {
            type: Boolean,
            default: true,
        },
        lastTriggered: {
            type: Date,
            default: null,
        },
        triggerCount: {
            type: Number,
            default: 0,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export const Alert = mongoose.model("Alert", alertSchema);
