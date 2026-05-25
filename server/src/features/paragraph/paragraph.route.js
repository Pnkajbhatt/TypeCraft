import express from "express";
const router = express.Router();
import authenticate from "../../middleware/auth.middleware.js";
import getNextParagraph, { getGuestParagraph } from "./paragraph.controller.js";

router.get("/new", authenticate, getNextParagraph);
router.get("/guest", getGuestParagraph);

export default router;
