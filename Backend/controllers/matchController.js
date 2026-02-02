import User from "../models/User.js";

export const getMatchSuggestions = async (req, res) => {
  try {
    const currentUser = req.user;

    // Safety check (should not happen, but good practice)
    if (
      !currentUser.skillsHave.length ||
      !currentUser.skillsWant.length
    ) {
      return res.status(400).json({
        message: "Complete your profile to see matches",
      });
    }

    // Find other users (exclude self)
    const users = await User.find({
      _id: { $ne: currentUser._id },
      skillsHave: { $exists: true, $ne: [] },
      skillsWant: { $exists: true, $ne: [] },
    }).select(
      "name collegeName year branch skillsHave skillsWant availability preferredMode"
    );

    const matches = [];

    for (let user of users) {
      const iWantTheyHave = currentUser.skillsWant.filter(skill =>
        user.skillsHave.includes(skill)
      );

      const theyWantIHave = user.skillsWant.filter(skill =>
        currentUser.skillsHave.includes(skill)
      );

      if (iWantTheyHave.length && theyWantIHave.length) {
        matches.push({
          userId: user._id,
          name: user.name,
          collegeName: user.collegeName,
          year: user.year,
          branch: user.branch,
          matchedSkills: {
            iLearn: iWantTheyHave,
            iTeach: theyWantIHave,
          },
          availability: user.availability,
          preferredMode: user.preferredMode,
        });
      }
    }

    res.status(200).json({
      count: matches.length,
      matches,
    });
  } catch (error) {
    console.error("Match error:", error.message);
    res.status(500).json({ message: "Failed to fetch matches" });
  }
};
