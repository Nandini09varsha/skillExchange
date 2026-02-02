import { useEffect, useState } from "react";
import API from "@/services/auth";

export default function MatchPage() {
  const [matches, setMatches] = useState({
    mutualMatches: [],
    recommendedForMe: [],
    iCanHelp: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      // ✅ Correct backend endpoint
      const res = await API.get("/match/suggestions");

      /**
       * Backend currently returns:
       * {
       *   count: number,
       *   matches: []
       * }
       *
       * For now, we map everything into "recommendedForMe".
       * Later you can enhance backend to return match types.
       */
      setMatches({
        mutualMatches: [],
        recommendedForMe: res.data.matches || [],
        iCanHelp: [],
      });
    } catch (err) {
      console.error("Match fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Finding best matches for you...
      </div>
    );
  }

  const Section = ({ title, data, emptyText }) => (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>

      {data.length === 0 ? (
        <p className="text-gray-400">{emptyText}</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {data.map((user) => (
            <div
              key={user._id}
              className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-xl"
            >
              <h3 className="text-xl font-medium mb-2">{user.name}</h3>

              {/* Optional reason */}
              {user.reason && (
                <p className="text-sm text-purple-400 mb-3">
                  {user.reason}
                </p>
              )}

              {/* Matched skills */}
              {user.matchedOn && (
                <div className="mb-3">
                  <p className="text-sm text-gray-400 mb-1">
                    Matched on:
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {user.matchedOn.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-sm bg-purple-500/20 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* You want */}
              {user.youWantTheyOffer && (
                <div className="mb-2">
                  <p className="text-sm text-gray-400">You want:</p>
                  <div className="flex gap-2 flex-wrap">
                    {user.youWantTheyOffer.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-green-500/20 rounded-full text-sm"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* They want */}
              {user.theyWantYouOffer && (
                <div>
                  <p className="text-sm text-gray-400">They want:</p>
                  <div className="flex gap-2 flex-wrap">
                    {user.theyWantYouOffer.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-500/20 rounded-full text-sm"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white px-10 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-semibold mb-10">
          Skill Matches
        </h1>

        <Section
          title="⭐ Mutual Matches"
          data={matches.mutualMatches}
          emptyText="No mutual matches yet. Add more skills to improve matches."
        />

        <Section
          title="🎯 Recommended For You"
          data={matches.recommendedForMe}
          emptyText="No recommendations yet. Try updating your profile skills."
        />

        <Section
          title="🤝 People You Can Help"
          data={matches.iCanHelp}
          emptyText="No users need your skills yet."
        />
      </div>
    </div>
  );
}
