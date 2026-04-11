// import MatchRequest from "../models/MatchRequest.js";

// /**
//  * @desc    Send a match request
//  * @route   POST /api/match-request/send
//  * @access  Private
//  */
// export const sendMatchRequest = async (req, res) => {
//   const { receiverId } = req.body;

//   if (!receiverId) {
//     return res.status(400).json({ message: "Receiver ID is required" });
//   }

//   const existing = await MatchRequest.findOne({
//     sender: req.user._id,
//     receiver: receiverId,
//     status: "pending",
//   });

//   if (existing) {
//     return res.status(400).json({ message: "Request already sent" });
//   }

//   const request = await MatchRequest.create({
//     sender: req.user._id,
//     receiver: receiverId,
//   });

//   res.status(201).json({
//     message: "Match request sent",
//     request,
//   });
// };

// /**
//  * @desc    Get incoming match requests
//  * @route   GET /api/match-request/incoming
//  * @access  Private
//  */
// export const getIncomingRequests = async (req, res) => {
//   const requests = await MatchRequest.find({
//     receiver: req.user._id,
//     status: "pending",
//   }).populate("sender", "name skillsHave");

//   res.json(requests);
// };

// /**
//  * @desc    Respond to match request
//  * @route   PUT /api/match-request/respond/:id
//  * @access  Private
//  */
// export const respondToRequest = async (req, res) => {
//   const { action } = req.body; // accept | reject

//   const request = await MatchRequest.findById(req.params.id);

//   if (!request) {
//     return res.status(404).json({ message: "Request not found" });
//   }

//   if (request.receiver.toString() !== req.user._id.toString()) {
//     return res.status(401).json({ message: "Not authorized" });
//   }

//   request.status = action === "accept" ? "accepted" : "rejected";
//   await request.save();

//   res.json({
//     message: `Request ${request.status}`,
//   });
// };

// import MatchRequest from "../models/MatchRequest.js";

// export const sendMatchRequest = async (req, res) => {
//   const { receiverId, skillRequested } = req.body;

//   if (!receiverId || !skillRequested) {
//     return res.status(400).json({
//       message: "receiverId and skillRequested are required",
//     });
//   }

//   const existingRequest = await MatchRequest.findOne({
//     fromUser: req.user._id,
//     toUser: receiverId,
//     status: "pending",
//   });

//   if (existingRequest) {
//     return res
//       .status(400)
//       .json({ message: "Request already sent" });
//   }

//   const request = await MatchRequest.create({
//     fromUser: req.user._id,
//     toUser: receiverId,
//     skillRequested,
//   });

//   res.status(201).json({
//     message: "Match request sent",
//     request,
//   });
// };
import MatchRequest from "../models/MatchRequest.js";

/**
 * 📩 Send match request
 */
export const sendMatchRequest = async (req, res) => {
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
    return res
      .status(400)
      .json({ message: "Request already sent" });
  }

  const request = await MatchRequest.create({
    fromUser: req.user._id,
    toUser: receiverId,
    skillRequested,
  });

  res.status(201).json({
    message: "Match request sent",
    request,
  });
};

/**
 * 📥 Get incoming requests
 */
export const getIncomingRequests = async (req, res) => {
  const requests = await MatchRequest.find({
    toUser: req.user._id,
    status: "pending",
  }).populate("fromUser", "name email skillsHave");

  res.json(requests);
};

/**
 * ✅ Accept / ❌ Reject request
 */
export const respondToRequest = async (req, res) => {
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

  res.json({
    message: `Request ${action}ed`,
    request,
  });
};
