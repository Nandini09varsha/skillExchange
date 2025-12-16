import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  user1: String,
  user2: String,
  skill: String,
  status: { type: String, default: "pending" }
});

export default mongoose.model("Match", matchSchema);
