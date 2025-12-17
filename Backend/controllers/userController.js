export const getMyProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const user = req.user;
    const { name, bio, skillsOffered, skillsWanted } = req.body;

    // Update only if provided
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;

    if (Array.isArray(skillsOffered)) {
      user.skillsOffered = skillsOffered;
    }

    if (Array.isArray(skillsWanted)) {
      user.skillsWanted = skillsWanted;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      skillsOffered: updatedUser.skillsOffered,
      skillsWanted: updatedUser.skillsWanted,
      rating: updatedUser.rating,
    });
  } catch (error) {
    res.status(500).json({ message: "Profile update failed" });
  }
};
