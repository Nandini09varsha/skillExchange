import express from "express";
import {
  createSession,
  acceptSession,
  completeSession,
} from "../controllers/sessionController.js";
import { protect } from "../middleware/authMiddleware.js";
import Session from "../models/Session.js";

const router = express.Router();

// =============================
// CREATE / UPDATE ROUTES
// =============================
router.post("/", createSession);
router.put("/accept/:id", acceptSession);
router.put("/complete/:id", completeSession);

// =============================
// DASHBOARD ROUTE
// =============================
router.get("/dashboard", async (req, res) => {
  try {
    // 👉 TEMP: get any userId from DB (since auth is off)
    const sampleSession = await Session.findOne();

    if (!sampleSession) {
      return res.json({
        teaching: {
          stats: { active: 0, completed: 0, pending: 0 },
          sessions: [],
        },
        learning: {
          stats: { active: 0, completed: 0, pending: 0 },
          sessions: [],
        },
      });
    }

    const userId = sampleSession.tutor;

    const teachingSessions = await Session.find({ tutor: userId });
    const learningSessions = await Session.find({ requester: userId });

    const countStats = (sessions) => ({
      active: sessions.filter((s) => s.status === "accepted").length,
      completed: sessions.filter((s) => s.status === "completed").length,
      pending: sessions.filter((s) => s.status === "pending").length,
    });

    res.json({
      teaching: {
        stats: countStats(teachingSessions),
        sessions: teachingSessions,
      },
      learning: {
        stats: countStats(learningSessions),
        sessions: learningSessions,
      },
    });
  } catch (err) {
    console.error("ERROR 👉", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
