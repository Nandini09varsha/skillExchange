import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://127.0.0.1:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error(
        "NotificationBell fetch error:",
        err.response?.data || err.message,
      );
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30s for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://127.0.0.1:5000/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.error("markAsRead error:", err.response?.data || err.message);
    }
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://127.0.0.1:5000/api/notifications/mark-all-read",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("markAllRead error:", err.response?.data || err.message);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-full hover:bg-white/10 transition"
        aria-label="Notifications"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h3 className="text-white font-semibold text-sm">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-blue-400 hover:text-blue-300 transition"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => {
                  navigate("/notifications");
                  setOpen(false);
                }}
                className="text-xs text-gray-400 hover:text-white transition"
              >
                See all
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">
                No notifications
              </p>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <div
                  key={n._id}
                  onClick={() => markAsRead(n._id)}
                  className={`px-4 py-3 cursor-pointer hover:bg-white/10 transition border-b border-white/5 ${
                    !n.isRead ? "bg-white/5" : ""
                  }`}
                >
                  <p
                    className={`text-sm ${n.isRead ? "text-gray-400" : "text-white"}`}
                  >
                    {!n.isRead && (
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 align-middle" />
                    )}
                    {n.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
