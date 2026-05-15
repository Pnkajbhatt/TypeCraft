import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";

export const securityMiddleware = [
  helmet(),
  cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }),
];

export const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10),

  limit: parseInt(process.env.RATE_LIMIT_MAX, 10),

  message: { error: "Too many requests, please try again later." },

  statusCode: 429,
});

export const validateRegister = [
  body("name").trim().notEmpty().withMessage("name is require"),

  body("email").trim().isEmail().normalizeEmail().withMessage("invalid email."),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be ar least * charactrs")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number.")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character."),

  body("profession_id")
    .notEmpty()
    .withMessage("Profession ID is required")
    .isUUID()
    .withMessage("invalid id")
    .custom(async (value) => {
      const result = await db.query(
        "SELECT id FROM professions WHERE id = $1",
        [value],
      );
      if (result.rows.length === 0) {
        throw new Error("Profession does not exist.");
      }
    }),
];

export const validateLogin = [
  body("email").trim().isEmail().normalizeEmail().withMessage("invalid email."),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be ar least * charactrs")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number.")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character."),
];

export default validateRegister;
