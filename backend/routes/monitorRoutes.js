import { Router } from "express";
import { protect as auth } from "../middlewares/authMiddleware.js";
import { monitorRules, validate } from "../validations/monitorValidateRequest.js";
import {
    createMonitor,
    getMonitors,
    updateMonitor,
    deleteMonitor,
} from "../controllers/monitorController.js";

const router = Router();

// All monitor routes are protected — must be logged in
router.use(auth);

router.post("/", monitorRules, validate, createMonitor);          // POST   /api/monitors
router.get("/", getMonitors);             // GET    /api/monitors
router.put("/:id", updateMonitor);        // PUT    /api/monitors/:id
router.delete("/:id", deleteMonitor);     // DELETE /api/monitors/:id

export default router;
