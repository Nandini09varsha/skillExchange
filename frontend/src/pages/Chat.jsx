/**
 * Chat.jsx — updated
 * Only change from original: 🎥 button now navigates to /video-call/:userId
 * All chat socket logic is unchanged.
 * WebRTC signaling is handled globally via SocketContext + VideoCallPage.
 */

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

const SOCKET_URL = "http://localhost:5000";

export default function Chat() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [currentUserId, setCurrentUserId] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const [chatUser, setChatUser] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const res = await fetch(`${SOCKET_URL}/api/users/${userId}`);
        const data = await res.json();
        setChatUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUserId(parsedUser.id);
    }
  }, []);

  useEffect(() => {
    if (!currentUserId || !userId) return;
    const createConversation = async () => {
      try {
        const res = await axios.post(`${SOCKET_URL}/api/conversation`, {
          senderId: currentUserId,
          receiverId: userId,
        });
        setConversationId(res.data._id);
      } catch (error) {
        console.log("Conversation error:", error);
      }
    };
    createConversation();
  }, [currentUserId, userId]);

  useEffect(() => {
    if (!conversationId) return;
    const loadMessages = async () => {
      try {
        const res = await axios.get(`${SOCKET_URL}/api/message/${conversationId}`);
        setMessages(res.data);
      } catch (error) {
        console.log("Load messages error:", error);
      }
    };
    loadMessages();

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    newSocket.emit("joinRoom", conversationId);
    newSocket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => { newSocket.disconnect(); };
  }, [conversationId]);

  const sendMessage = () => {
    if (!message.trim() || !socket || !conversationId) return;
    socket.emit("sendMessage", {
      conversationId,
      sender: currentUserId,
      text: message,
    });
    setMessage("");
  };

  // ── Navigate to full-screen video call page ──────────────────────────────
  const handleVideoCall = () => {
    navigate(`/video-call/${userId}`, {
      state: { remoteName: chatUser?.name || userId },
    });
  };

  if (!currentUserId || !conversationId) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="h-screen w-screen bg-[#0b141a] flex flex-col">
      {/* HEADER */}
      <div className="h-16 bg-[#202c33] flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
            {chatUser?.name?.charAt(0)?.toUpperCase() || userId?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">
              {chatUser ? chatUser.name : "Loading..."}
            </h2>
            <p className="text-gray-400 text-xs">Online</p>
          </div>
        </div>

        <div className="flex gap-4 text-gray-400">
          {/* ✅ Video call button */}
          <button
            onClick={handleVideoCall}
            title="Start video call"
            className="hover:text-white transition text-xl"
          >
            🎥
          </button>
          <button className="hover:text-white transition">&#8942;</button>
        </div>
      </div>

      {/* MESSAGE AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0b141a]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-sm break-words shadow-md ${
                msg.sender === currentUserId
                  ? "bg-[#005c4b] text-white rounded-br-none"
                  : "bg-[#202c33] text-white rounded-bl-none"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className="text-[10px] text-gray-300 mt-1 text-right">
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="h-20 bg-[#202c33] flex items-center px-6 gap-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 bg-[#2a3942] text-white px-4 py-3 rounded-full outline-none"
          placeholder="Type a message"
        />
        <button
          onClick={sendMessage}
          className="bg-[#00a884] hover:bg-[#019875] px-6 py-2 rounded-full text-white font-medium transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
