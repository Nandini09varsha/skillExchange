import { useEffect, useState } from "react";
import API from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    bio: "",
    skillsOffered: [],
    skillsWanted: [],
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/user/me");
      setProfile(res.data);
      setFormData({
        bio: res.data.bio || "",
        skillsOffered: res.data.skillsOffered || [],
        skillsWanted: res.data.skillsWanted || [],
      });
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await API.put("/user/me", formData);
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const addSkill = (type, value) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], { name: value }],
    }));
  };

  const removeSkill = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white px-10 py-10">
      <div className="max-w-4xl mx-auto bg-white/10 border border-white/20 rounded-3xl p-10 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-purple-500 flex items-center justify-center text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-semibold">{profile.name}</h1>
              <p className="text-gray-400">{profile.email}</p>
            </div>
          </div>

          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        {/* Rating */}
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-2">Rating</h2>
          <p className="text-lg text-purple-400">
            ⭐ {profile.rating || 0} / 5
          </p>
        </div>

        {/* Skills Offered */}
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-2">Skills Offered</h2>

          <div className="flex gap-3 flex-wrap mb-3">
            {(isEditing ? formData.skillsOffered : profile.skillsOffered)?.map(
              (skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-purple-500/20 rounded-full flex items-center gap-2"
                >
                  {skill.name}
                  {isEditing && (
                    <button
                      onClick={() => removeSkill("skillsOffered", idx)}
                      className="text-red-400"
                    >
                      ✕
                    </button>
                  )}
                </span>
              )
            )}
          </div>

          {isEditing && (
            <Input
              placeholder="Add skill"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addSkill("skillsOffered", e.target.value);
                  e.target.value = "";
                }
              }}
            />
          )}
        </div>

        {/* Skills Wanted */}
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-2">Skills Wanted</h2>

          <div className="flex gap-3 flex-wrap mb-3">
            {(isEditing ? formData.skillsWanted : profile.skillsWanted)?.map(
              (skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-blue-500/20 rounded-full flex items-center gap-2"
                >
                  {skill.name}
                  {isEditing && (
                    <button
                      onClick={() => removeSkill("skillsWanted", idx)}
                      className="text-red-400"
                    >
                      ✕
                    </button>
                  )}
                </span>
              )
            )}
          </div>

          {isEditing && (
            <Input
              placeholder="Add skill"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addSkill("skillsWanted", e.target.value);
                  e.target.value = "";
                }
              }}
            />
          )}
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-2">Bio</h2>

          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
              rows={4}
            />
          ) : (
            <p className="text-gray-300">
              {profile.bio || "No bio added yet"}
            </p>
          )}
        </div>

        {/* Save */}
        {isEditing && (
          <Button onClick={handleSave} className="bg-green-500">
            Save Changes
          </Button>
        )}
      </div>
    </div>
  );
}
