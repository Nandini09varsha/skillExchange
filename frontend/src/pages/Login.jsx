import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loginUser } from "@/services/auth";
import { GoogleLogin } from "@react-oauth/google";
import api from "../lib/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser(form);
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 GOOGLE LOGIN HANDLER
  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("TOKEN:", credentialResponse);
    try {
      const res = await api.post(
        `${import.meta.env.VITE_API_URL}/auth/google`,
        {
          token: credentialResponse.credential,
        },
      );

      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f172a] via-[#020617] to-black">
      <Card className="w-110 bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_60px_rgba(168,85,247,0.35)] rounded-3xl">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-4xl font-semibold text-white">
            Welcome Back
          </CardTitle>
          <p className="text-m text-gray-400">
            Login to your SkillSwap account
          </p>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8">
          <Input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="bg-white/10 border-white/20 text-white h-12"
          />

          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              className="bg-white/10 border-white/20 text-white pr-14 h-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          <p
            onClick={() => navigate("/forgot-password")}
            className="text-purple-400 text-sm cursor-pointer text-right hover:underline"
          >
            Forgot Password?
          </p>

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-600 h-12"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* 🔥 Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>

          {/* 🔥 Google Login Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google Login Failed")}
            />
          </div>

          <p className="text-center text-gray-400">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-purple-400 cursor-pointer hover:underline"
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
