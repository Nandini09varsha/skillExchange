import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MatchPage from "./pages/MatchPage";
import ProfileLayout from "@/pages/Profile/ProfileLayout";
import IncomingRequests from "./pages/IncomingRequests";
import Search from "./pages/Search";
import Chat from "./pages/Chat";
import Chats from "./pages/Chats";
import PublicProfile from "./pages/PublicProfile";
import VideoCallPage from "./pages/VideoCallPage";        // ✅ NEW
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/resetPassword";

import { useAuth } from "./context/AuthContext";
import { useSocket } from "./context/SocketContext";      // ✅ NEW
import IncomingCallBanner from "./components/video/IncomingCallBanner"; // ✅ NEW

export default function App() {
  const { isAuth } = useAuth();
  const { socket, incomingCall, clearIncomingCall } = useSocket(); // ✅ NEW

  return (
    <BrowserRouter>
      {/* ── Global incoming-call banner ─────────────────────────────────
          Mounted here so it appears on EVERY page, not just Chat.
          Navigates callee to VideoCallPage on accept.
      ──────────────────────────────────────────────────────────────── */}
      {isAuth && (
        <IncomingCallBanner
          incomingCall={incomingCall}
          socket={socket}
          onAccept={clearIncomingCall}
          onReject={clearIncomingCall}
        />
      )}

      <Routes>
        {/* HOME */}
        <Route path="/" element={isAuth ? <Home /> : <Navigate to="/login" />} />

        {/* AUTH */}
        <Route path="/login" element={!isAuth ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuth ? <Register /> : <Navigate to="/" />} />

        {/* FORGOT / RESET PASSWORD */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* PROFILE */}
        <Route path="/profile" element={isAuth ? <ProfileLayout /> : <Navigate to="/login" />} />

        {/* MATCHES */}
        <Route path="/matches" element={isAuth ? <MatchPage /> : <Navigate to="/login" />} />

        {/* REQUESTS */}
        <Route path="/requests" element={isAuth ? <IncomingRequests /> : <Navigate to="/login" />} />

        {/* SEARCH */}
        <Route path="/search" element={isAuth ? <Search /> : <Navigate to="/login" />} />

        {/* PUBLIC PROFILE */}
        <Route path="/profile/:id" element={<PublicProfile />} />

        {/* CHAT */}
        <Route path="/chat/:userId" element={<Chat />} />
        <Route path="/chats" element={<Chats />} />

        {/* ✅ VIDEO CALL — dedicated full-screen route */}
        <Route
          path="/video-call/:userId"
          element={isAuth ? <VideoCallPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
