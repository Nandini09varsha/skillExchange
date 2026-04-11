import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const { skill } = req.query; // 👈 THIS LINE IS IMPORTANT

    if (!skill) {
      return res.status(400).json({ message: "Skill query is required" });
    }

    const users = await User.find({
      skillsOffered: { $regex: skill, $options: "i" },
    })
      .select("-password")
      .sort({ rating: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
