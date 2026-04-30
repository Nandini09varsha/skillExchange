import Session from "../models/Session.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

/* Create Session Request */
export const createSession = async (req, res) => {
  try {
    const { requesterId, tutorId, skill, message, mode } = req.body;

    if (!requesterId || !tutorId || !skill || !mode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const requester = await User.findById(requesterId);

    if (!requester || requester.credits < 1) {
      return res.status(400).json({ message: "Not enough credits" });
    }

    const session = await Session.create({
      requester: requesterId,
      tutor: tutorId,
      skill,
      message,
      mode,
    });

    await Notification.create({
      user: tutorId,
      type: "session",
      message: `${requester.name} sent you a session request for "${skill}"`,
    });

    res.status(201).json(session);
  } catch (error) {
    console.error("createSession error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* Accept Session */
export const acceptSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    session.status = "accepted";
    await session.save();

    await Notification.create({
      user: session.requester,
      type: "session",
      message: "Your session request was accepted!",
    });

    res.json(session);
  } catch (error) {
    console.error("acceptSession error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* Complete Session (Credit Transfer Happens Here) */
export const completeSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status === "completed") {
      return res.status(400).json({ message: "Already completed" });
    }

    if (session.status !== "accepted") {
      return res.status(400).json({ message: "Session not accepted yet" });
    }

    const requester = await User.findById(session.requester);
    const tutor = await User.findById(session.tutor);

    // Credit transfer
    requester.credits -= 1;
    tutor.credits += 1;

    requester.sessionsLearned += 1;
    tutor.sessionsTaught += 1;

    await requester.save();
    await tutor.save();

    session.status = "completed";
    await session.save();

    await Notification.create({
      user: session.requester,
      type: "session",
      message: `Your session on "${session.skill}" has been completed!`,
    });

    res.json({ message: "Session completed successfully" });
  } catch (error) {
    console.error("completeSession error:", error);
    res.status(500).json({ message: "Server error" });
  }
};