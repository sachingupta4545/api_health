import { Router } from "express";
import { protect as auth } from "../middlewares/authMiddleware.js";
import { monitorRules, monitorUpdateRules, validate } from "../validations/monitorValidateRequest.js";
import {
    createMonitor,
    getMonitors,
    getMonitorById,
    updateMonitor,
    deleteMonitor,
    getMonitorLogs,
    getMonitorStats,
    getDashboardMetrics,
} from "../controllers/monitorController.js";

const router = Router();

// All monitor routes are protected — must be logged in
router.use(auth);

router.post("/", monitorRules, validate, createMonitor);
router.get("/", getMonitors);
router.get("/dashboard", getDashboardMetrics);
router.get("/:id", getMonitorById);
router.put("/:id", monitorUpdateRules, validate, updateMonitor);
router.delete("/:id", deleteMonitor);
router.get("/:id/logs", getMonitorLogs);
router.get("/:id/stats", getMonitorStats);

export default router;
