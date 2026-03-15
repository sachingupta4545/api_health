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
} from "../controllers/monitorController.js";

const router = Router();

// All monitor routes are protected — must be logged in
router.use(auth);

router.post("/", monitorRules, validate, createMonitor);             // POST   /api/monitors
router.get("/", getMonitors);                                        // GET    /api/monitors
router.get("/:id", getMonitorById);                                  // GET    /api/monitors/:id
router.put("/:id", monitorUpdateRules, validate, updateMonitor);     // PUT    /api/monitors/:id
router.delete("/:id", deleteMonitor);                                // DELETE /api/monitors/:id
router.get("/:id/logs", getMonitorLogs);                             // GET    /api/monitors/:id/logs
router.get("/:id/stats", getMonitorStats);                           // GET    /api/monitors/:id/stats

export default router;
