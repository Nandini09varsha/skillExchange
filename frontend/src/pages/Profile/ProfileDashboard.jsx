import ProfileHeader from "./components/ProfileHeader";
import StatCard from "./components/StatCard";
import TaskList from "./components/TaskList";
import ScoreCard from "./components/ScoreCard";
import StatisticsCard from "./components/StatisticsCard";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ProfileDashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  // ✅ FETCH DATA FROM BACKEND
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:5000/api/sessions/dashboard",
        );

        console.log("Dashboard Data:", res.data);
        setDashboardData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* ===== TOP ROW (HEADER + SCORE) ===== */}
      <div className="grid grid-cols-[3fr_1.2fr] gap-6 items-stretch">
        <ProfileHeader />

        {/* Score aligned to top like Dribbble */}
        <ScoreCard className="h-full min-h-55" />
      </div>

      {/* ===== MAIN CONTENT ROW ===== */}
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
