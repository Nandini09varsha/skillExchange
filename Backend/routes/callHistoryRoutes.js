import express from "express";
import CallHistory from "../models/CallHistory.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/calls/history
 * Returns call history for the authenticated user (as caller or callee).
 * Sorted by newest first. Populates caller/callee names.
 */
router.get("/history", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const calls = await CallHistory.find({
      $or: [{ caller: userId }, { callee: userId }],
    })
      .populate("caller", "name email")
      .populate("callee", "name email")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(calls);
  } catch (err) {
    console.error("Call history fetch error:", err);
    res.status(500).json({ message: "Failed to fetch call history" });
  }
});

/**
 * GET /api/calls/history/:userId
 * Returns calls between the authenticated user and a specific other user.
 */
router.get("/history/:userId", protect, async (req, res) => {
  try {
    const me = req.user._id;
    const other = req.params.userId;

    const calls = await CallHistory.find({
      $or: [
        { caller: me, callee: other },
        { caller: other, callee: me },
      ],
    })
      .populate("caller", "name email")
      .populate("callee", "name email")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(calls);
  } catch (err) {
    console.error("Call history fetch error:", err);
    res.status(500).json({ message: "Failed to fetch call history" });
  }
});

export default router;
