import mongoose from "mongoose";

/**
 * CallHistory — persists every video call session between two users.
 * Written by the server via Socket.IO signaling events, never by REST.
 *
 * Lifecycle:
 *   call-user     → create doc  { status: "calling" }
 *   answer-call   → update doc  { status: "active", startedAt: now }
 *   end-call      → update doc  { status: "ended",  endedAt: now, duration: seconds }
 *   reject-call   → update doc  { status: "rejected" }
 *   call-failed   → update doc  { status: "missed" }
 */
const callHistorySchema = new mongoose.Schema(
  {
    caller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    callee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Socket-level call ID so we can update the same doc across events
    callId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["calling", "active", "ended", "rejected", "missed"],
      default: "calling",
    },
    startedAt: {
      type: Date,
      default: null,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    // Duration in seconds — computed on end-call
    duration: {
      type: Number,
      default: 0,
    },
    hadScreenShare: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Virtual: human-readable duration like "02:34"
callHistorySchema.virtual("durationFormatted").get(function () {
  const m = Math.floor(this.duration / 60)
    .toString()
    .padStart(2, "0");
  const s = (this.duration % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
});

callHistorySchema.set("toJSON", { virtuals: true });

export default mongoose.model("CallHistory", callHistorySchema);
