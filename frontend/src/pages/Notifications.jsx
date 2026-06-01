import { useEffect, useState } from "react";
import axios from "axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found — user not logged in");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        "h${import.meta.env.VITE_API_URL}/api/notifications",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setNotifications(res.data);
    } catch (err) {
      console.error(
        "Fetch notifications error:",
        err.response?.data || err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.error("Mark as read error:", err.response?.data || err.message);
    }
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "${import.meta.env.VITE_API_URL}/api/notifications/mark-all-read",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Mark all read error:", err.response?.data || err.message);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/notifications/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-400 mt-1">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm text-blue-400 hover:text-blue-300 border border-blue-400/30 px-3 py-1.5 rounded-lg transition hover:bg-blue-400/10"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🔔</p>
            <p className="text-gray-400 text-lg">No notifications yet</p>
            <p className="text-gray-600 text-sm mt-1">
              You'll see match requests, session updates, and messages here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`flex items-start gap-3 p-4 rounded-xl border transition group ${
                  n.isRead
                    ? "bg-white/5 border-white/5"
                    : "bg-white/10 border-blue-500/20"
                }`}
              >
                {/* Unread dot */}
                <div className="mt-1.5">
                  {!n.isRead ? (
                    <span className="block w-2.5 h-2.5 rounded-full bg-blue-500" />
                  ) : (
                    <span className="block w-2.5 h-2.5 rounded-full bg-transparent" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm leading-snug ${
                      n.isRead ? "text-gray-400" : "text-white"
                    }`}
                  >
                    {n.message}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-gray-500">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                        n.type === "request"
                          ? "bg-purple-500/20 text-purple-300"
                          : n.type === "session"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      {n.type}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition shrink-0">
                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n._id)}
                      title="Mark as read"
                      className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 rounded border border-blue-400/30 hover:bg-blue-400/10 transition"
                    >
                      ✓ Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n._id)}
                    title="Delete"
                    className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded border border-red-400/30 hover:bg-red-400/10 transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
