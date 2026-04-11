<<<<<<< HEAD
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
=======
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

export default function Chat() {
  const { userId } = useParams(); // other user id
>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f

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
<<<<<<< HEAD
    const fetchUser = async () => {
      try {
        const res = await fetch(`${SOCKET_URL}/api/users/${userId}`);
=======

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${userId}`);
>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
        const data = await res.json();
        setChatUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
<<<<<<< HEAD
    fetchUser();
  }, [userId]);

=======

    fetchUser();
  }, [userId]);

  // Load logged in user
>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUserId(parsedUser.id);
    }
  }, []);

<<<<<<< HEAD
  useEffect(() => {
    if (!currentUserId || !userId) return;
    const createConversation = async () => {
      try {
        const res = await axios.post(`${SOCKET_URL}/api/conversation`, {
          senderId: currentUserId,
          receiverId: userId,
        });
=======
  // 🔥 Create or Get Conversation
  useEffect(() => {
    if (!currentUserId || !userId) return;

    const createConversation = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/conversation", {
          senderId: currentUserId,
          receiverId: userId,
        });

>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
        setConversationId(res.data._id);
      } catch (error) {
        console.log("Conversation error:", error);
      }
    };
<<<<<<< HEAD
    createConversation();
  }, [currentUserId, userId]);

  useEffect(() => {
    if (!conversationId) return;
    const loadMessages = async () => {
      try {
        const res = await axios.get(`${SOCKET_URL}/api/message/${conversationId}`);
=======

    createConversation();
  }, [currentUserId, userId]);

  // 🔥 Setup Socket After conversationId exists
  useEffect(() => {
    if (!conversationId) return;

    const loadMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/message/${conversationId}`,
        );
>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
        setMessages(res.data);
      } catch (error) {
        console.log("Load messages error:", error);
      }
    };
<<<<<<< HEAD
    loadMessages();

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    newSocket.emit("joinRoom", conversationId);
    newSocket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => { newSocket.disconnect(); };
=======

    loadMessages();

    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.emit("joinRoom", conversationId);

    newSocket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      newSocket.disconnect();
    };
>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
  }, [conversationId]);

  const sendMessage = () => {
    if (!message.trim() || !socket || !conversationId) return;
<<<<<<< HEAD
=======

>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
    socket.emit("sendMessage", {
      conversationId,
      sender: currentUserId,
      text: message,
    });
<<<<<<< HEAD
    setMessage("");
  };

  // ── Navigate to full-screen video call page ──────────────────────────────
  const handleVideoCall = () => {
    navigate(`/video-call/${userId}`, {
      state: { remoteName: chatUser?.name || userId },
    });
=======

    setMessage("");
>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
  };

  if (!currentUserId || !conversationId) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="h-screen w-screen bg-[#0b141a] flex flex-col">
<<<<<<< HEAD
      {/* HEADER */}
      <div className="h-16 bg-[#202c33] flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
            {chatUser?.name?.charAt(0)?.toUpperCase() || userId?.charAt(0)?.toUpperCase()}
=======
      {/* ===== HEADER ===== */}
      <div className="h-16 bg-[#202c33] flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
            {userId?.charAt(0).toUpperCase()}
>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">
              {chatUser ? chatUser.name : "Loading..."}
            </h2>
            <p className="text-gray-400 text-xs">Online</p>
          </div>
        </div>

<<<<<<< HEAD
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
=======
        {/* Future buttons section */}
        <div className="flex gap-4 text-gray-400">
          <button className="hover:text-white transition">📞</button>
          <button className="hover:text-white transition">🎥</button>
          <button className="hover:text-white transition">⋮</button>
        </div>
      </div>

      {/* ===== MESSAGE AREA ===== */}
>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
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
<<<<<<< HEAD
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
=======

        <div ref={messagesEndRef} />
      </div>

      {/* ===== INPUT AREA ===== */}
>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
      <div className="h-20 bg-[#202c33] flex items-center px-6 gap-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 bg-[#2a3942] text-white px-4 py-3 rounded-full outline-none"
          placeholder="Type a message"
        />
<<<<<<< HEAD
=======

>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
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
