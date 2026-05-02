import express from "express";
import {
  createSession,
  acceptSession,
  completeSession,
} from "../controllers/sessionController.js";
import Session from "../models/Session.js";

const router = express.Router();

// =============================
// CREATE SESSION
// =============================
router.post("/", createSession);

// =============================
// ACCEPT SESSION
// =============================
router.put("/accept/:id", acceptSession);

// =============================
// REJECT SESSION
// =============================
router.put("/reject/:id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session.status = "rejected";
    await session.save();

    res.json({ message: "Session rejected successfully" });

  } catch (err) {
    console.error("Reject session error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// COMPLETE SESSION
// =============================
router.put("/complete/:id", completeSession);

// =============================
// DASHBOARD ROUTE
// =============================
router.get("/dashboard", async (req, res) => {
  try {

    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId required" });
    }

    // Sessions where user is tutor (incoming requests)
    const teachingSessions = await Session
      .find({ tutor: userId })
      .populate("requester", "name");

    // Sessions where user is requester (sent requests)
    const learningSessions = await Session
      .find({ requester: userId })
      .populate("tutor", "name");

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
    console.error("Dashboard error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;