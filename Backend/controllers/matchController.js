import User from "../models/User.js";

/**
 * GET /api/match
 * Returns mutual matches, recommended matches, and users I can help
 */
export const getMatches = async (req, res) => {
  try {
    const me = req.user;

    // Normalize my skills
    const myWanted = me.skillsWanted?.map((s) => s.name.toLowerCase()) || [];
    const myOffered = me.skillsOffered?.map((s) => s.name.toLowerCase()) || [];

    // Get all other users
    const users = await User.find({ _id: { $ne: me._id } }).select(
      "-password"
    );

    const mutualMatches = [];
    const recommendedForMe = [];
    const iCanHelp = [];

    users.forEach((user) => {
      const userWanted =
        user.skillsWanted?.map((s) => s.name.toLowerCase()) || [];
      const userOffered =
        user.skillsOffered?.map((s) => s.name.toLowerCase()) || [];

      // Intersections
      const wantedMatch = myWanted.filter((skill) =>
        userOffered.includes(skill)
      );

      const offeredMatch = myOffered.filter((skill) =>
        userWanted.includes(skill)
      );

      // Mutual match
      if (wantedMatch.length > 0 && offeredMatch.length > 0) {
        mutualMatches.push({
          _id: user._id,
          name: user.name,
          skillsOffered: user.skillsOffered,
          skillsWanted: user.skillsWanted,
          matchedOn: {
            youWantTheyOffer: wantedMatch,
            theyWantYouOffer: offeredMatch,
          },
          reason: "Mutual skill exchange",
        });
      }
      // Recommended for me
      else if (wantedMatch.length > 0) {
        recommendedForMe.push({
          _id: user._id,
          name: user.name,
          skillsOffered: user.skillsOffered,
          matchedOn: wantedMatch,
          reason: "They offer skills you want",
        });
      }
      // I can help
      else if (offeredMatch.length > 0) {
        iCanHelp.push({
          _id: user._id,
          name: user.name,
          skillsWanted: user.skillsWanted,
          matchedOn: offeredMatch,
          reason: "They want skills you offer",
        });
      }
    });

    res.status(200).json({
      mutualMatches,
      recommendedForMe,
      iCanHelp,
    });
  } catch (error) {
    console.error("Match error:", error);
    res.status(500).json({ message: "Failed to get matches" });
  }
};
