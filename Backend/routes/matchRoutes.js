import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMatchSuggestions } from "../controllers/matchController.js";

const router = express.Router();

router.get("/suggestions", protect, getMatchSuggestions);

export default router;
