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
    },

    year: {
      type: String,
    },

    branch: {
      type: String,
    },

    bio: {
      type: String,
      maxlength: 150,
    },

    // CORE MATCHING DATA
    skillsOffered: [
      {
        type: String,
      },
    ],

    skillsWanted: [
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
    // REVIEW SYSTEM
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          maxlength: 300,
        },
      },
    ],
  },

  { timestamps: true },
);

userSchema.virtual("avgRating").get(function () {
  if (!this.reviews || this.reviews.length === 0) return 0;

  const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  return (total / this.reviews.length).toFixed(1);
});

userSchema.set("toJSON", { virtuals: true });

export default mongoose.model("User", userSchema);
