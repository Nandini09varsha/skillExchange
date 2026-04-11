import ProfileHeader from "./components/ProfileHeader";
import StatCard from "./components/StatCard";
import TaskList from "./components/TaskList";
import ScoreCard from "./components/ScoreCard";
import StatisticsCard from "./components/StatisticsCard";
import { useState } from "react";

export default function ProfileDashboard() {
  const [stats, setStats] = useState({
    activeGoals: 3,
    completedTasks: 6,
    dueTasks: 2,
  });

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
            <StatCard title="Active Goals" value={stats.activeGoals} />
            <StatCard title="Completed Tasks" value={stats.completedTasks} />
            <StatCard title="Due Tasks" value={stats.dueTasks} />
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
