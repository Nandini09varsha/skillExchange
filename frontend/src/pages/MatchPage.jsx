import { useEffect, useState } from "react";
import API from "@/services/auth";

export default function MatchPage() {
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔎 Filters
  const [skill, setSkill] = useState("");
  const [availability, setAvailability] = useState("");
  const [mode, setMode] = useState("");

  // 🔔 Track sent requests
  const [sentRequests, setSentRequests] = useState([]);

  useEffect(() => {
    fetchMatches();
    // eslint-disable-next-line
  }, [skill, availability, mode]);

  const fetchMatches = async () => {
    try {
      setLoading(true);

      const params = {};
      if (skill) params.skill = skill;
      if (availability) params.availability = availability;
      if (mode) params.mode = mode;

      const res = await API.get("/match/suggestions", { params });
      setMatches(res.data);
    } catch (err) {
      console.error("Match fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 📩 SEND MATCH REQUEST
  const sendRequest = async (user, skillRequested) => {
    try {
      await API.post("/match-request/send", {
        receiverId: user._id,
        skillRequested,
      });

      setSentRequests((prev) => [...prev, user._id]);
      alert("Request sent successfully ✅");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Request failed");
    }
  };

  if (loading || !matches) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Finding best matches for you...
      </div>
    );
  }

  const Section = ({ title, data, emptyText }) => (
    <div className="mb-12">
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
              <h3 className="text-xl font-medium mb-1">{user.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{user.bio}</p>

              {user.reason && (
                <p className="text-sm text-purple-400 mb-3">
                  {user.reason}
                </p>
              )}

              {/* Mutual match */}
              {user.matchedOn?.youWantTheyOffer && (
                <div className="mb-2">
                  <p className="text-sm text-gray-400 mb-1">You want:</p>
                  <div className="flex gap-2 flex-wrap">
                    {user.matchedOn.youWantTheyOffer.map((s, i) => (
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

              {user.matchedOn?.theyWantYouOffer && (
                <div className="mb-2">
                  <p className="text-sm text-gray-400 mb-1">They want:</p>
                  <div className="flex gap-2 flex-wrap">
                    {user.matchedOn.theyWantYouOffer.map((s, i) => (
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

              {/* One-way match */}
              {Array.isArray(user.matchedOn) && (
                <div className="flex gap-2 flex-wrap mb-3">
                  {user.matchedOn.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-500/20 rounded-full text-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* 🔘 REQUEST BUTTON */}
              <button
                disabled={sentRequests.includes(user._id)}
                onClick={() =>
                  sendRequest(
                    user,
                    user.matchedOn?.youWantTheyOffer?.[0] ||
                      user.matchedOn?.[0]
                  )
                }
                className={`mt-4 w-full py-2 rounded-lg text-sm transition
                  ${
                    sentRequests.includes(user._id)
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-purple-500 hover:bg-purple-600"
                  }`}
              >
                {sentRequests.includes(user._id)
                  ? "Request Sent"
                  : "Request Session"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white px-10 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-semibold mb-8">Skill Matches</h1>

        {/* 🔍 FILTER BAR */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <input
            type="text"
            placeholder="Search by skill (e.g. React)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none"
          />

          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
          >
            <option value="">All Availability</option>
            <option value="Weekdays">Weekdays</option>
            <option value="Weekends">Weekends</option>
            <option value="Evenings">Evenings</option>
          </select>

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
          >
            <option value="">All Modes</option>
            <option value="Chat">Chat</option>
            <option value="Call">Call</option>
            <option value="VC">VC</option>
          </select>
        </div>

        <Section
          title="⭐ Mutual Matches"
          data={matches.mutualMatches}
          emptyText="No mutual matches yet. Add more skills to improve matches."
        />

        <Section
          title="🎯 Recommended For You"
          data={matches.recommendedForMe}
          emptyText="No recommendations yet."
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
