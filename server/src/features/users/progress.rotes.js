import express from "express";
const router = express.Router();

import { getProgress } from "./progress.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";

router.get("/progress", authenticate, getProgress);

export default router;
