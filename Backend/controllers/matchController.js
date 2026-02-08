// import User from "../models/User.js";

// export const getMatchSuggestions = async (req, res) => {
//   try {
//     const currentUser = req.user;

//     // Safety check (should not happen, but good practice)
//     if (
//       !currentUser.skillsHave.length ||
//       !currentUser.skillsWant.length
//     ) {
//       return res.status(400).json({
//         message: "Complete your profile to see matches",
//       });
//     }

//     // Find other users (exclude self)
//     const users = await User.find({
//       _id: { $ne: currentUser._id },
//       skillsHave: { $exists: true, $ne: [] },
//       skillsWant: { $exists: true, $ne: [] },
//     }).select(
//       "name collegeName year branch skillsHave skillsWant availability preferredMode"
//     );

//     const matches = [];

//     for (let user of users) {
//       const iWantTheyHave = currentUser.skillsWant.filter(skill =>
//         user.skillsHave.includes(skill)
//       );

//       const theyWantIHave = user.skillsWant.filter(skill =>
//         currentUser.skillsHave.includes(skill)
//       );

//       if (iWantTheyHave.length && theyWantIHave.length) {
//         matches.push({
//           userId: user._id,
//           name: user.name,
//           collegeName: user.collegeName,
//           year: user.year,
//           branch: user.branch,
//           matchedSkills: {
//             iLearn: iWantTheyHave,
//             iTeach: theyWantIHave,
//           },
//           availability: user.availability,
//           preferredMode: user.preferredMode,
//         });
//       }
//     }

//     res.status(200).json({
//       count: matches.length,
//       matches,
//     });
//   } catch (error) {
//     console.error("Match error:", error.message);
//     res.status(500).json({ message: "Failed to fetch matches" });
//   }
// };

import User from "../models/User.js";

export const getMatchSuggestions = async (req, res) => {
  try {
    const currentUser = req.user;

    const { skill, availability, mode } = req.query;

    const users = await User.find({ _id: { $ne: currentUser._id } });

    const mutualMatches = [];
    const recommendedForMe = [];
    const iCanHelp = [];

    users.forEach((user) => {
      // Optional filters
      if (availability && user.availability !== availability) return;
      if (mode && user.preferredMode !== mode) return;

      const youWantTheyOffer = currentUser.skillsWant.filter((s) =>
        user.skillsHave.includes(s)
      );

      const theyWantYouOffer = user.skillsWant.filter((s) =>
        currentUser.skillsHave.includes(s)
      );

      if (skill) {
        const skillMatch =
          youWantTheyOffer.includes(skill) ||
          theyWantYouOffer.includes(skill);

        if (!skillMatch) return;
      }

      if (youWantTheyOffer.length && theyWantYouOffer.length) {
        mutualMatches.push({
          ...user.toObject(),
          matchedOn: {
            youWantTheyOffer,
            theyWantYouOffer,
          },
        });
      } else if (youWantTheyOffer.length) {
        recommendedForMe.push({
          ...user.toObject(),
          reason: "They offer skills you want",
          matchedOn: youWantTheyOffer,
        });
      } else if (theyWantYouOffer.length) {
        iCanHelp.push({
          ...user.toObject(),
          reason: "They want skills you offer",
          matchedOn: theyWantYouOffer,
        });
      }
    });

    res.json({
      count:
        mutualMatches.length +
        recommendedForMe.length +
        iCanHelp.length,
      mutualMatches,
      recommendedForMe,
      iCanHelp,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
