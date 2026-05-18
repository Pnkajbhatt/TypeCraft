import express from "express";
const router = express.Router();

import { authenticate } from "../../middleware/auth.middleware.js";
import { completeSession } from "./session.controller.js";

router.post("/complete", authenticate, completeSession);

export default router;
