import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    skillsOffered: [{
      name: String,
      level: String
    }],
    skillsWanted: [{
      name: String
    }],
    bio: String,
    rating: {
      type: Number,
      default: 0
    }
    
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
