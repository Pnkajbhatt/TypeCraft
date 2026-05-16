import express from "express";
const router = express.Router();
import authenticate from "../../middleware/paragraph.middleware.js";
import getNextParagraph from "./paragraph.controller.js";

router.get("/next", authenticate, getNextParagraph);

export default router;
