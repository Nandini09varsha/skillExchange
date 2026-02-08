import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./context/AuthContext";
import MatchPage from "./pages/MatchPage";
import ProfileLayout from "@/pages/Profile/ProfileLayout";
import IncomingRequests from "./pages/IncomingRequests";

export default function App() {
  const { isAuth } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuth ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={!isAuth ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuth ? <Register /> : <Navigate to="/" />} />
        <Route path="/profile" element={isAuth ? <ProfileLayout /> : <Navigate to="/login" />} />
        <Route path="/matches" element={isAuth ? <MatchPage /> : <Navigate to="/login" />} />
        <Route path="/requests" element={isAuth ? <IncomingRequests /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

