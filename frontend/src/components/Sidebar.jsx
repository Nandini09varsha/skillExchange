import { LayoutDashboard, Settings, User } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-20 lg:w-64 bg-[#0f172a] border-r border-white/10 flex flex-col items-center py-8 gap-10">
      {/* Logo */}
      <div className="text-2xl font-bold text-purple-400">⚡</div>

      {/* Navigation */}
      <nav className="flex flex-col gap-6 text-sm">
        <NavItem to="" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <NavItem to="profile" icon={<User size={20} />} label="Profile" />
        <NavItem to="settings" icon={<Settings size={20} />} label="Settings" />
      </nav>
    </aside>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition
         ${isActive ? "bg-purple-500/20 text-purple-300" : "hover:bg-white/10"}`
      }
    >
      {icon}
      <span className="hidden lg:block">{label}</span>
    </NavLink>
  );
}
