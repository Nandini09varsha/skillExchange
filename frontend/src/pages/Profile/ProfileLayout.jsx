import ProfileSidebar from "./ProfileSidebar";
import ProfileDashboard from "./ProfileDashboard";

export default function ProfileLayout() {
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-[#020617] to-black text-white flex">
      {/* Sidebar */}
      <ProfileSidebar />

      {/* Main content */}
      <main className="flex-1 px-12 py-10">
        {/* FULL WIDTH CONTAINER (Dribbble-style) */}
        <div className="w-full">
          <ProfileDashboard />
        </div>
      </main>
    </div>
  );
}
