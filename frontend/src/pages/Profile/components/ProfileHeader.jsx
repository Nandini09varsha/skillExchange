import { useRef, useState } from "react";
import { Camera, Pencil } from "lucide-react";

export default function ProfileHeader() {
  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/100");

  const [name, setName] = useState("Nandini Verma");
  const [role, setRole] = useState("SkillSwap Tutor");
  const [location, setLocation] = useState("India");

  const [editingField, setEditingField] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImage(URL.createObjectURL(file));
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-7 flex justify-between items-center">
      {/* LEFT */}
      <div className="flex items-center gap-6">
        {/* PROFILE IMAGE */}
        <div className="relative group">
          <img
            src={profileImage}
            className="w-30 h-30 rounded-full object-cover border border-white/20"
          />

          <button
            onClick={() => fileInputRef.current.click()}
            className="
              absolute inset-0 rounded-full
              bg-black/60 flex items-center justify-center
              opacity-0 group-hover:opacity-100 transition
            "
          >
            <Camera size={26} className="text-white" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* TEXT INFO */}
        <div className="space-y-1">
          {/* NAME */}
          <div className="flex items-center gap-2 group">
            {editingField === "name" ? (
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                className="bg-transparent border-b border-purple-500 text-4xl font-semibold outline-none"
              />
            ) : (
              <h2
                className="text-4xl font-semibold cursor-pointer"
                onClick={() => setEditingField("name")}
              >
                {name}
              </h2>
            )}

            <Pencil
              size={18}
              className="opacity-0 group-hover:opacity-100 text-gray-400 cursor-pointer"
              onClick={() => setEditingField("name")}
            />
          </div>

          {/* ROLE */}
          <div className="flex items-center gap-2 group">
            {editingField === "role" ? (
              <input
                autoFocus
                value={role}
                onChange={(e) => setRole(e.target.value)}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                className="bg-transparent border-b border-purple-500 text-2xl text-gray-300 outline-none"
              />
            ) : (
              <p
                className="text-gray-400 text-2xl cursor-pointer"
                onClick={() => setEditingField("role")}
              >
                {role}
              </p>
            )}

            <Pencil
              size={16}
              className="opacity-0 group-hover:opacity-100 text-gray-400 cursor-pointer"
              onClick={() => setEditingField("role")}
            />
          </div>

          {/* LOCATION */}
          <div className="flex items-center gap-2 group">
            {editingField === "location" ? (
              <input
                autoFocus
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                className="
        bg-transparent border-b border-purple-500
        text-m text-gray-400 outline-none
      "
              />
            ) : (
              <p
                className="text-xl text-gray-500 cursor-pointer"
                onClick={() => setEditingField("location")}
              >
                📍 {location}
              </p>
            )}

            <Pencil
              size={14}
              className="opacity-0 group-hover:opacity-100 text-gray-400 cursor-pointer"
              onClick={() => setEditingField("location")}
            />
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="bg-white/10 rounded-2xl p-4 text-sm">
        <p className="mb-2">Start where you left</p>
        <button className="bg-purple-600 px-4 py-2 rounded-xl text-sm">
          Jump to session
        </button>
      </div>
    </div>
  );
}
