import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { registerUser } from "@/services/auth";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
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
            Create Account
          </CardTitle>
          <p className="text-m text-gray-400">
            Join SkillSwap and start learning
          </p>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8">
          {/* Name */}
          <Input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="
              bg-white/10
              border-white/20
              text-white
              text-lg!
              h-14!
              px-4
              placeholder:text-gray-400
              focus:ring-2 focus:ring-purple-400
            "
          />

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
              h-14!
              px-4
              placeholder:text-gray-400
              focus:ring-2 focus:ring-purple-400
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
                h-14!
                px-4
                pr-14
                placeholder:text-gray-400
                focus:ring-2 focus:ring-purple-400
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

          {/* Register Button */}
          <Button
            onClick={handleRegister}
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
            {loading ? "Creating account..." : "Create Account"}
          </Button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-400 pt-2">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-purple-400 cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
