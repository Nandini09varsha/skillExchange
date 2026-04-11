import { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f172a] via-[#020617] to-black">
      <Card className="w-110 bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_60px_rgba(168,85,247,0.35)] rounded-3xl">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-3xl text-white">
            Forgot Password
          </CardTitle>
          <p className="text-gray-400">
            Enter your email to receive reset link
          </p>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/10 border-white/20 text-white h-12"
          />

          <Button
            onClick={handleSubmit}
            className="w-full bg-purple-500 hover:bg-purple-600 h-12"
          >
            Send Reset Link
          </Button>

          {message && (
            <p className="text-center text-sm text-green-400">{message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;