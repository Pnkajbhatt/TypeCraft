import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const securityMiddleware = [
  helmet(),
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000", // React default
      "http://127.0.0.1:5173",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  }),
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

  body("password_hash")
    .isLength({ min: 8 })
    .withMessage("Password must be ar least * charactrs")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number.")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character."),

  body("profession_name")
    .notEmpty()
    .withMessage("Profession is required")
    .custom(async (value) => {
      const result = await db.query(
        "SELECT id FROM professions WHERE name = $1",
        [value],
      );
      if (result.rows.length === 0) {
        throw new Error("Profession does not exist.");
      }
    }),
];

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  next();
};

export const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "no token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token.", err });
    }

    req.userId = user.userId;
    next();
  });
};

export const validateLogin = [
  body("email").trim().isEmail().normalizeEmail().withMessage("invalid email."),

  body("password").notEmpty().withMessage("Password is required"),
];

export default authenticate;
