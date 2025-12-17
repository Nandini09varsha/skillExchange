import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuth, logout } = useAuth();

  const navItems = ["Home", "Skills", "Tutors", "Pricing", "About"];

  return (
    <nav className="flex items-center justify-between px-10 py-6">
      {/* Logo */}
      <Link to="/">
        <h1 className="text-3xl font-semibold tracking-wide cursor-pointer">
          SkillSwap
        </h1>
      </Link>

      {/* Center Nav */}
      <div className="hidden md:flex items-center gap-1 px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
        {navItems.map((item) => (
          <span
            key={item}
            className="px-7 py-3 text-[18px] font-medium text-gray-300 rounded-full
                       cursor-pointer transition-all duration-300
                       hover:text-white hover:bg-purple-500/30"
          >
            {item}
          </span>
        ))}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {!isAuth ? (
          <>
            <Link to="/login">
              <Button
                variant="outline"
                className="border-white/20 text-white px-9 py-6 text-[18px]
                           hover:bg-white/10 rounded-full"
              >
                Sign In
              </Button>
            </Link>

            <Link to="/register">
              <Button
                className="bg-purple-400 hover:bg-purple-950
                           px-9 py-6 text-[15px] rounded-full"
              >
                Create Account
              </Button>
            </Link>
          </>
        ) : (
          <>
            {/* Avatar + Name */}
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
              {/* Avatar Circle */}
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              {/* Name */}
              <span className="text-white text-[16px] font-medium">
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
