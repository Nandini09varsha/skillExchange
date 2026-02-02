import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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

    collegeName: {
      type: String,
      required: true,
    },

    year: {
      type: String,
      enum: ["1st", "2nd", "3rd", "4th"],
      required: true,
    },

    branch: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      maxlength: 150,
    },

    // CORE MATCHING DATA
    skillsHave: [
      {
        type: String,
      },
    ],

    skillsWant: [
      {
        type: String,
      },
    ],

    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    availability: {
      type: String,
      enum: ["Weekdays", "Weekends", "Evenings"],
    },

    preferredMode: {
      type: String,
      enum: ["Chat", "Call", "VC"],
      default: "Chat",
    },

    // CREDIT SYSTEM
    credits: {
      type: Number,
      default: 10, // starting credits
    },

    sessionsTaught: {
      type: Number,
      default: 0,
    },

    sessionsLearned: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
