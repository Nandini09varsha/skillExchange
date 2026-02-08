import mongoose from "mongoose";

const matchRequestSchema = new mongoose.Schema(
  {
    // 👤 Who is requesting
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 👤 Who receives the request
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🎯 Skill requester wants to learn
    skillRequested: {
      type: String,
      required: true,
    },

    // 🤝 Skill requester offers in return (optional for now)
    skillOffered: {
      type: String,
    },

    // 🔄 Request lifecycle
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    // 📝 Optional message
    message: {
      type: String,
      maxlength: 200,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MatchRequest", matchRequestSchema);
