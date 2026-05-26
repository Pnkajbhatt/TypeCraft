import express from "express";
const router = express.Router();
import register, { getCurrentUser, login } from "./auth.controller.js";
import authenticate from "../../middleware/auth.middleware.js";

import {
  validateRegister,
  authLimiter,
  securityMiddleware,
  validateLogin,
  validateRequest,
} from "../../middleware/auth.middleware.js";

router.use(...securityMiddleware);
router.post(
  "/register",
  authLimiter,
  validateRegister,
  validateRequest,
  register,
);
router.post("/login", authLimiter, validateLogin, validateRequest, login);
router.get("/me", authenticate, getCurrentUser);

export default router;
