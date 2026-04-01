import { verifyToken } from "../utils/token.js";
import { User } from "../models/User.js";

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const decoded = verifyToken(token);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User no longer exists." });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};
