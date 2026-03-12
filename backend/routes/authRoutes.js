import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import { registerRules, loginRules, validate } from "../validations/authValidateRequest.js";

const router = Router();

// POST /api/auth/register
router.post("/register", ...registerRules, validate, register);

// POST /api/auth/login
router.post("/login", ...loginRules, validate, login);


export default router;
