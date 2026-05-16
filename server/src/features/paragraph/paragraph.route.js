import express from "express";
const router = express.Router();
import authenticate from "../../middleware/auth.middleware.js";
import getNextParagraph from "./paragraph.controller.js";

router.get("/new", authenticate, getNextParagraph);

export default router;
