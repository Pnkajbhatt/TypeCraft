import express from "express";
const router = express.Router();

import { authenticate } from "../../middleware/auth.middleware.js";
import {
  completeSession,
  getSessionById,
  getSessions,
} from "./session.controller.js";

router.post("/complete", authenticate, completeSession);
router.get("/history", authenticate, getSessions);
router.get("/:sessionId", authenticate, getSessionById);

export default router;
