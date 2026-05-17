import express from "express";
const router = express.Router();

import { autheniticate } from "../../middleware/auth.middleware.js";
import { completeSession } from "./session.controller.js";

router.post("/complete", autheniticate, completeSession);

export default router;
