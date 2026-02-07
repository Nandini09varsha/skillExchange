import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  searchUsersBySkill,
  getMutualMatches,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.get("/search", searchUsersBySkill);
router.get("/matches", protect, getMutualMatches);

export default router;
