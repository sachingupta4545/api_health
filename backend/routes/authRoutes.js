import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login } from "../controllers/authController.js";
import { registerRules, loginRules, validate } from "../validations/authValidateRequest.js";

// Rate limit: max 10 requests per 15 minutes per IP on auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again after 15 minutes." },
});

const router = Router();

// POST /api/auth/register
router.post("/register", authLimiter, ...registerRules, validate, register);

// POST /api/auth/login
router.post("/login", authLimiter, ...loginRules, validate, login);

export default router;
