import { body, validationResult } from "express-validator";

// ─── Validation Rules (Create) ────────────────────────────────
// All fields required on create

export const monitorRules = [
    body("name")
        .trim()
        .notEmpty().withMessage("Monitor name is required")
        .isLength({ min: 2 }).withMessage("Monitor name must be at least 2 characters"),

    body("url")
        .trim()
        .notEmpty().withMessage("URL is required")
        .isURL().withMessage("Please provide a valid URL"),

    body("method")
        .trim()
        .notEmpty().withMessage("Method is required")
        .isIn(["GET", "POST", "PUT", "DELETE", "HEAD"]).withMessage("Invalid method"),

    body("interval")
        .trim()
        .notEmpty().withMessage("Interval is required")
        .isInt({ min: 10 }).withMessage("Interval must be at least 10 seconds"),

    body("timeout")
        .trim()
        .notEmpty().withMessage("Timeout is required")
        .isInt({ min: 1 }).withMessage("Timeout must be at least 1 second"),

    body("alert_contact")
        .trim()
        .notEmpty().withMessage("Alert contact is required")
        .isEmail().withMessage("Please provide a valid email")
        .normalizeEmail(),

    body("status")
        .optional()
        .trim()
        .isIn(["active", "paused"]).withMessage("Invalid status"),
];

// ─── Validation Rules (Update) ────────────────────────────────
// All fields optional on update — only validate what's provided

export const monitorUpdateRules = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage("Monitor name must be at least 2 characters"),

    body("url")
        .optional()
        .trim()
        .isURL().withMessage("Please provide a valid URL"),

    body("method")
        .optional()
        .trim()
        .isIn(["GET", "POST", "PUT", "DELETE", "HEAD"]).withMessage("Invalid method"),

    body("interval")
        .optional()
        .isInt({ min: 10 }).withMessage("Interval must be at least 10 seconds"),

    body("timeout")
        .optional()
        .isInt({ min: 1 }).withMessage("Timeout must be at least 1 second"),

    body("alert_contact")
        .optional()
        .trim()
        .isEmail().withMessage("Please provide a valid email")
        .normalizeEmail(),

    body("status")
        .optional()
        .trim()
        .isIn(["active", "paused"]).withMessage("Invalid status"),
];

// ─── Validate Middleware ───────────────────────────
// Collects all rule errors and returns them in one go
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
};