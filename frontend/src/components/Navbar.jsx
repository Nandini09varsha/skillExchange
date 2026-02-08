import { Button } from "@/components/ui/button";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuth, logout } = useAuth();

  // ✅ Nav items with routes
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Matches", path: "/matches" },
    { label: "Requests", path: "/requests" },
    { label: "About", path: "/about" },
  ];

  return (
    <nav className="flex items-center justify-between px-10 py-6">
      {/* Logo */}
      <Link to="/">
        <h1 className="text-3xl font-semibold tracking-wide cursor-pointer text-white">
          SkillSwap
        </h1>
      </Link>

      {/* Center Navigation */}
      <div className="hidden md:flex items-center gap-1 px-3 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `px-6 py-3 text-[16px] font-medium rounded-full transition-all duration-300
               ${
                 isActive
                   ? "bg-purple-500/40 text-white"
                   : "text-gray-300 hover:text-white hover:bg-purple-500/30"
               }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {!isAuth ? (
          <>
            <Link to="/login">
              <Button
                variant="outline"
                className="border-white/20 text-white px-8 py-5 text-[16px]
                           hover:bg-white/10 rounded-full"
              >
                Sign In
              </Button>
            </Link>

            <Link to="/register">
              <Button
                className="bg-purple-500 hover:bg-purple-600
                           px-8 py-5 text-[15px] rounded-full"
              >
                Create Account
              </Button>
            </Link>
          </>
        ) : (
          <>
            {/* Profile */}
            <div
              onClick={() => navigate("/profile")}
              className="
                flex items-center gap-3
                px-4 py-2
                rounded-full
                bg-white/10
                border border-white/20
                cursor-pointer
                hover:bg-white/20
                transition
              "
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>

              {/* Name */}
              <span className="text-white text-[15px] font-medium">
                {user?.name}
              </span>
            </div>

            {/* Logout */}
            <Button
              onClick={logout}
              className="
                bg-red-500/80
                hover:bg-red-600
                px-6 py-5
                rounded-full
                text-white
              "
            >
              Logout
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
