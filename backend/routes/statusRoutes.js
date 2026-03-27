import { Router } from "express";
import { protect as auth } from "../middlewares/authMiddleware.js";
import { getStatusPageData } from "../controllers/statusController.js";

const router = Router();

// Endpoint for status page aggregation
router.get("/", auth, getStatusPageData);

export default router;
