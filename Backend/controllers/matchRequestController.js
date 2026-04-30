import MatchRequest from "../models/MatchRequest.js";
import Notification from "../models/Notification.js";

/**
 * 📩 Send match request
 */
export const sendMatchRequest = async (req, res) => {
  try {
    const { receiverId, skillRequested } = req.body;

    if (!receiverId || !skillRequested) {
      return res.status(400).json({
        message: "receiverId and skillRequested are required",
      });
    }

    // Prevent duplicate pending requests
    const existing = await MatchRequest.findOne({
      fromUser: req.user._id,
      toUser: receiverId,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const request = await MatchRequest.create({
      fromUser: req.user._id,
      toUser: receiverId,
      skillRequested,
    });

    // 🔔 Notify the receiver
    await Notification.create({
      user: receiverId,
      type: "request",
      message: `${req.user.name} sent you a match request for "${skillRequested}"`,
    });

    res.status(201).json({
      message: "Match request sent",
      request,
    });
  } catch (error) {
    console.error("sendMatchRequest error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * 📥 Get incoming requests
 */
export const getIncomingRequests = async (req, res) => {
  try {
    const requests = await MatchRequest.find({
      toUser: req.user._id,
      status: "pending",
    }).populate("fromUser", "name email skillsHave");

    res.json(requests);
  } catch (error) {
    console.error("getIncomingRequests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ Accept / ❌ Reject request
 */
export const respondToRequest = async (req, res) => {
  try {
    const { action } = req.body;

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const request = await MatchRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = action === "accept" ? "accepted" : "rejected";
    await request.save();

    // 🔔 Notify the sender about the response
    await Notification.create({
      user: request.fromUser,
      type: "request",
      message:
        action === "accept"
          ? `${req.user.name} accepted your match request for "${request.skillRequested}"!`
          : `${req.user.name} declined your match request for "${request.skillRequested}".`,
    });

    res.json({
      message: `Request ${action}ed`,
      request,
    });
  } catch (error) {
    console.error("respondToRequest error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
