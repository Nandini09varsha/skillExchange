import { useState } from "react";
import axios from "axios";
import ResultCard from "@/components/ResultCard";

export default function Search() {
  const [skill, setSkill] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!skill.trim()) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/search?skill=${skill}`,
      );

      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0f2c] to-[#2c0f3f] text-white p-10">
      {/* 🔍 SEARCH BAR */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center">
          Find Your Learning Partner
        </h2>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search skill (e.g. Python, Guitar)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            onClick={handleSearch}
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-all"
          >
            Search
          </button>
        </div>
      </div>

      {/* RESULTS */}
      <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {loading && <p className="col-span-full text-center">Searching...</p>}

        {!loading && results.length === 0 && (
          <p className="col-span-full text-center text-gray-400">
            No results yet
          </p>
        )}

        {results.map((user) => (
          <ResultCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
}
