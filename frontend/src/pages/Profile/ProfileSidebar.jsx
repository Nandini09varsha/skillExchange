import { LayoutGrid, User, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProfileSidebar() {
  return (
    <aside className="w-20 bg-[#020617] border-r border-white/10 flex flex-col items-center py-6 gap-8">
      <Link to="/" className="sidebar-icon">
        ⚡
      </Link>

      <nav className="flex flex-col gap-6 text-gray-400">
        <LayoutGrid className="hover:text-white cursor-pointer" />
        <User className="hover:text-white cursor-pointer" />
        <Settings className="hover:text-white cursor-pointer" />
      </nav>
    </aside>
  );
}
