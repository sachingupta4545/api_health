import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },
    },
    { timestamps: true }
);

// Automatically hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;  // Mongoose 7+: async hooks don't receive next()
    this.password = await bcrypt.hash(this.password, 12);
});

// Instance method to compare passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);