import User from "../models/User.js";

// GET logged-in user profile
export const getMyProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// UPDATE profile
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

    // 🔐 Enforce profile completion rule
    if (!Array.isArray(skillsHave) || skillsHave.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one skill you have is required" });
    }

    if (!Array.isArray(skillsWant) || skillsWant.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one skill you want is required" });
    }

    // Update fields only if provided
    if (name !== undefined) user.name = name;
    if (collegeName !== undefined) user.collegeName = collegeName;
    if (year !== undefined) user.year = year;
    if (branch !== undefined) user.branch = branch;
    if (bio !== undefined) user.bio = bio;

    user.skillsHave = skillsHave;
    user.skillsWant = skillsWant;

    if (skillLevel !== undefined) user.skillLevel = skillLevel;
    if (availability !== undefined) user.availability = availability;
    if (preferredMode !== undefined) user.preferredMode = preferredMode;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Profile update failed" });
  }
};
