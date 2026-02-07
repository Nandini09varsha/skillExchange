import User from "../models/User.js";

/* ===============================
   GET LOGGED-IN USER PROFILE
================================= */
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* ===============================
   UPDATE PROFILE
================================= */
export const updateMyProfile = async (req, res) => {
  try {
    const user = req.user;

    const {
      name,
      collegeName,
      year,
      branch,
      bio,
      skillsHave,
      skillsWant,
      skillLevel,
      availability,
      preferredMode,
    } = req.body;

    // 🔐 Validate skills only if provided
    if (skillsHave && (!Array.isArray(skillsHave) || skillsHave.length === 0)) {
      return res
        .status(400)
        .json({ message: "At least one skill you have is required" });
    }

    if (skillsWant && (!Array.isArray(skillsWant) || skillsWant.length === 0)) {
      return res
        .status(400)
        .json({ message: "At least one skill you want is required" });
    }

    // Update only provided fields
    if (name !== undefined) user.name = name;
    if (collegeName !== undefined) user.collegeName = collegeName;
    if (year !== undefined) user.year = year;
    if (branch !== undefined) user.branch = branch;
    if (bio !== undefined) user.bio = bio;
    if (skillsHave !== undefined) user.skillsHave = skillsHave;
    if (skillsWant !== undefined) user.skillsWant = skillsWant;
    if (skillLevel !== undefined) user.skillLevel = skillLevel;
    if (availability !== undefined) user.availability = availability;
    if (preferredMode !== undefined) user.preferredMode = preferredMode;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        ...updatedUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Profile update failed" });
  }
};

/* ===============================
   SEARCH USERS BY SKILL
   Example:
   /api/users/search?skill=python
================================= */
export const searchUsersBySkill = async (req, res) => {
  try {
    const { skill } = req.query;

    if (!skill) {
      return res.status(400).json({ message: "Skill is required" });
    }

    const users = await User.find({
      skillsHave: { $regex: skill, $options: "i" },
    })
      .select("-password")
      .sort({ sessionsTaught: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
};

/* ===============================
   MUTUAL MATCH LOGIC (Advanced)
   Finds users who:
   - Have skill I want
   - Want skill I have
================================= */
export const getMutualMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    const matches = await User.find({
      _id: { $ne: currentUser._id },

      skillsHave: { $in: currentUser.skillsWant },
      skillsWant: { $in: currentUser.skillsHave },
    })
      .select("-password")
      .sort({ sessionsTaught: -1 });

    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch matches" });
  }
};
