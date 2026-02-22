import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

export default function Chat() {
  const { userId } = useParams(); // other user id

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
        const res = await fetch(`http://localhost:5000/api/users/${userId}`);
        const data = await res.json();
        setChatUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [userId]);

  // Load logged in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUserId(parsedUser.id);
    }
  }, []);

  // 🔥 Create or Get Conversation
  useEffect(() => {
    if (!currentUserId || !userId) return;

    const createConversation = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/conversation", {
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

  // 🔥 Setup Socket After conversationId exists
  useEffect(() => {
    if (!conversationId) return;

    const loadMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/message/${conversationId}`,
        );
        setMessages(res.data);
      } catch (error) {
        console.log("Load messages error:", error);
      }
    };

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

  if (!currentUserId || !conversationId) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="h-screen w-screen bg-[#0b141a] flex flex-col">
      {/* ===== HEADER ===== */}
      <div className="h-16 bg-[#202c33] flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
            {userId?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">
              {chatUser ? chatUser.name : "Loading..."}
            </h2>
            <p className="text-gray-400 text-xs">Online</p>
          </div>
        </div>

        {/* Future buttons section */}
        <div className="flex gap-4 text-gray-400">
          <button className="hover:text-white transition">📞</button>
          <button className="hover:text-white transition">🎥</button>
          <button className="hover:text-white transition">⋮</button>
        </div>
      </div>

      {/* ===== MESSAGE AREA ===== */}
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

      {/* ===== INPUT AREA ===== */}
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
