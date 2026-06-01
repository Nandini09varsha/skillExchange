import { useState } from "react";
import axios from "axios";

export default function SkillsSection({ title, skills, type, refreshProfile }) {
  const [input, setInput] = useState("");
  const token = localStorage.getItem("token");

  const handleAdd = async () => {
    if (!input.trim()) return;

    const updatedSkills = [...skills, input.trim()];

    try {
      await axios.put(
        "http://127.0.0.1:5000/api/users/me",
        {
          [type]: updatedSkills,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setInput("");
      refreshProfile(); // 🔥 reload updated data
    } catch (err) {
      console.error(err);
      alert("Failed to add skill");
    }
  };

  const handleRemove = async (skillToRemove) => {
    const updatedSkills = skills.filter((s) => s !== skillToRemove);

    try {
      await axios.put(
        "http://127.0.0.1:5000/api/users/me",
        {
          [type]: updatedSkills,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      refreshProfile();
    } catch (err) {
      console.error(err);
      alert("Failed to remove skill");
    }
  };

  return (
    <div className="bg-white/5 p-5 rounded-xl border border-white/10">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>

      {/* SKILLS LIST */}
      <div className="flex flex-wrap gap-2 mb-3">
        {skills.length === 0 ? (
          <p className="text-gray-400">No skills added yet</p>
        ) : (
          skills.map((skill, index) => (
            <div
              key={index}
              className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full flex items-center gap-2"
            >
              {skill}
              <button
                onClick={() => handleRemove(skill)}
                className="text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add skill..."
          className="flex-1 px-3 py-2 rounded-lg bg-black/40 text-white border border-white/20"
        />

        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600"
        >
          Add
        </button>
      </div>
    </div>
  );
}
