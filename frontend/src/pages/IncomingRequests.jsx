import { useEffect, useState } from "react";
import API from "@/services/auth";

export default function IncomingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/match-request/incoming");
      setRequests(res.data);
    } catch (err) {
      console.error("Fetch incoming requests error:", err);
    } finally {
      setLoading(false);
    }
  };

  const respond = async (requestId, action) => {
    try {
      await API.post("/match-request/respond", {
        requestId,
        action, // "accepted" | "rejected"
      });

      // Remove handled request from UI
      setRequests((prev) =>
        prev.filter((req) => req._id !== requestId)
      );
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading incoming requests...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white px-10 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold mb-8">
          Incoming Requests
        </h1>

        {requests.length === 0 ? (
          <p className="text-gray-400">
            No pending requests right now.
          </p>
        ) : (
          <div className="space-y-6">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-xl"
              >
                <h3 className="text-xl font-medium">
                  {req.fromUser.name}
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  Wants to learn:{" "}
                  <span className="text-purple-400">
                    {req.skillRequested}
                  </span>
                </p>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() =>
                      respond(req._id, "accepted")
                    }
                    className="px-5 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      respond(req._id, "rejected")
                    }
                    className="px-5 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm"
                  >
                    Reject
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
