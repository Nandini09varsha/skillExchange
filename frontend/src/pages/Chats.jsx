import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Chats() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUserId(parsedUser.id);
    }
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          `https://skillswap-5t5e.onrender.com/api/conversation/${currentUserId}`,
        );
        setConversations(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchConversations();
  }, [currentUserId]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Chats</h2>

        {conversations.map((conv) => {
          const otherUser = conv.participants.find(
            (p) => p._id !== currentUserId,
          );

          return (
            <div
              key={conv._id}
              onClick={() => navigate(`/chat/${otherUser._id}`)}
              className="p-4 border border-white/20 rounded-lg mb-3 cursor-pointer hover:bg-white/10 transition"
            >
              <h3 className="font-semibold">{otherUser.name}</h3>
              <p className="text-gray-400 text-sm">
                {conv.lastMessage || "Start chatting..."}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
