import express from "express";
const router = express.Router();

import { getProgress } from "./progress.controller.js";

import { autheniticate } from "../../middleware/auth.middleware.js";

router.get("/progress", autheniticate, getProgress);

export default router;
