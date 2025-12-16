import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loginUser } from "@/services/auth";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const data = await loginUser(form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f172a] via-[#020617] to-black">
      <Card
        className="
          w-110
          bg-white/10
          backdrop-blur-xl
          border border-white/20
          shadow-[0_0_60px_rgba(168,85,247,0.35)]
          rounded-3xl
        "
      >
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-4xl font-semibold text-white">
            Welcome Back
          </CardTitle>
          <p className="text-m text-gray-400">
            Login to your SkillSwap account
          </p>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8">
          {/* Email */}
          <Input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="
              bg-white/10
              border-white/20
              text-white
              text-lg!
              placeholder:text-gray-400
              focus:ring-2 focus:ring-purple-400
              h-12
            "
          />

          {/* Password */}
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              className="
                bg-white/10
                border-white/20
                text-white
                text-lg!
                placeholder:text-gray-400
                pr-14
                focus:ring-2 focus:ring-purple-400
                h-12
              "
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="
                absolute right-4 top-1/2 -translate-y-1/2
                text-gray-400
                hover:text-white
                cursor-pointer
                transition
                hover:scale-110
              "
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="
              w-full
              bg-purple-500
              hover:bg-purple-600
              text-white
              h-12
              text-lg
              rounded-xl
              shadow-lg
              cursor-pointer
              disabled:cursor-not-allowed
            "
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* Footer */}
          <p className="text-center text-m text-gray-400 pt-2">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-purple-400 text-m cursor-pointer hover:underline"
            >
              Create one
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
