import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  searchUsers,
  getMutualMatches,
  getUserById,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

router.get("/search", searchUsers);
router.get("/matches", protect, getMutualMatches);
router.get("/:id", getUserById);

export default router;
