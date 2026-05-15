import express from "express";
const router = express.Router();
import register from "./auth.controller.js";
import { login } from "./auth.controller.js";

import {
  validateRegister,
  authLimiter,
  securityMiddleware,
  validateLogin,
} from "../../middleware/auth.middleware.js";

router.use(...securityMiddleware);
router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);

export default router;
