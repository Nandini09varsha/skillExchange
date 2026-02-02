import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/userController.js";

const router = express.Router();

// Get logged-in user profile
router.get("/me", protect, getMyProfile);

// Update profile details
router.put("/profile", protect, updateMyProfile);

export default router;
