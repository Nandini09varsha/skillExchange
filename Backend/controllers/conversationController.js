import Conversation from "../models/Conversation.js";

// ✅ Create or get conversation
export const createOrGetConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "Both users required" });
    }

    // Check if conversation exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (conversation) {
      return res.status(200).json(conversation);
    }

    // Create new conversation
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });

    res.status(201).json(conversation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all conversations of a user
export const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name email")
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
