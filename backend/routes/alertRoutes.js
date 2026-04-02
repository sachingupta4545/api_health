import express from "express";
import {
    createAlert,
    getAlerts,
    getAlertById,
    updateAlert,
    deleteAlert,
} from "../controllers/alertController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply protection to all routes
router.use(protect);

router.route("/").post(createAlert).get(getAlerts);

router.route("/:id").get(getAlertById).put(updateAlert).delete(deleteAlert);

export default router;
