import ProfileHeader from "./components/ProfileHeader";
import StatCard from "./components/StatCard";
import TaskList from "./components/TaskList";
import ScoreCard from "./components/ScoreCard";
import StatisticsCard from "./components/StatisticsCard";
import SkillsSection from "./components/SkillsSection";

import { useState, useEffect } from "react";
import api from "../../lib/api";

export default function ProfileDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [profile, setProfile] = useState(null);

  // ==============================
  // FETCH DASHBOARD
  // ==============================
  const fetchDashboard = async () => {
    try {
      const res = await api.get(
        "${import.meta.env.VITE_API_URL}/api/sessions/dashboard",
      );
      setDashboardData(res.data);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
    }
  };

  // ==============================
  // FETCH PROFILE
  // ==============================
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(
        "${import.meta.env.VITE_API_URL}/api/users/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log("PROFILE:", res.data);
      setProfile(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // ==============================
  // LOAD DATA
  // ==============================
  useEffect(() => {
    const loadData = async () => {
      await fetchDashboard();
      await fetchProfile();
    };

    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* ===== TOP ROW ===== */}
      <div className="grid grid-cols-[3fr_1.2fr] gap-6 items-stretch">
        <ProfileHeader user={profile} />
        <ScoreCard className="h-full min-h-55" />
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="grid grid-cols-[3fr_1.2fr] gap-6 items-stretch">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <StatCard
              title="Active Goals"
              value={dashboardData?.teaching?.stats?.active || 0}
            />

            <StatCard
              title="Completed Tasks"
              value={dashboardData?.teaching?.stats?.completed || 0}
            />

            <StatCard
              title="Due Tasks"
              value={dashboardData?.teaching?.stats?.pending || 0}
            />
          </div>

          {/* 🔥 FULLY FUNCTIONAL SKILLS */}
          <div className="grid grid-cols-2 gap-6">
            <SkillsSection
              title="Skills I Offer"
              skills={profile?.skillsHave || []}
              type="skillsHave"
              refreshProfile={fetchProfile}
            />

            <SkillsSection
              title="Skills I Want"
              skills={profile?.skillsWant || []}
              type="skillsWant"
              refreshProfile={fetchProfile}
            />
          </div>

          {/* Tasks */}
          <TaskList />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col">
          <StatisticsCard className="flex-1" />
        </div>
      </div>
    </div>
  );
}
