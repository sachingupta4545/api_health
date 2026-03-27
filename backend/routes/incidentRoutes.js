import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getIncidents,
    getIncidentById,
    createIncident,
    updateIncident,
    deleteIncident,
} from "../controllers/incidentController.js";

const router = express.Router();

// Protect all routes
router.use(protect);

router.route("/").get(getIncidents).post(createIncident);
router.route("/:id").get(getIncidentById).put(updateIncident).delete(deleteIncident);

export default router;
