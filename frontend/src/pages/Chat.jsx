import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useSocket } from "../context/SocketContext";

export default function Chat() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { socket } = useSocket();

  const [currentUserId, setCurrentUserId] = useState(null);
  const [conversationId, setConversationId] = useState(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [chatUser, setChatUser] = useState(null);

  const messagesEndRef = useRef(null);

  // ==============================
  // AUTO SCROLL
  // ==============================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ==============================
  // FETCH CHAT USER
  // ==============================
  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await api.get(`/api/users/${userId}`);

        setChatUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [userId]);

  // ==============================
  // CURRENT USER
  // ==============================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      setCurrentUserId(parsedUser.id);
    }
  }, []);

  // ==============================
  // CREATE / GET CONVERSATION
  // ==============================
  useEffect(() => {
    if (!currentUserId || !userId) return;

    const createConversation = async () => {
      try {
        const res = await api.post("/api/conversation", {
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

  // ==============================
  // VIDEO CALL SOCKETS
  // ==============================
  useEffect(() => {
    if (!socket || !currentUserId) return;

    const handleVideoRequest = (data) => {
      const accept = window.confirm(`${data.name} wants to start a video call`);

      if (accept) {
        socket.emit("videoCallAccepted", {
          to: data.from,
          from: currentUserId,
        });

        navigate(`/video-call/${data.from}`, {
          state: {
            remoteName: data.name,
          },
        });
      }
    };

    const handleVideoAccepted = (data) => {
      navigate(`/video-call/${data.from}`, {
        state: {
          remoteName: chatUser?.name || userId,
        },
      });
    };

    socket.off("videoCallRequest");
    socket.off("videoCallAccepted");

    socket.on("videoCallRequest", handleVideoRequest);

    socket.on("videoCallAccepted", handleVideoAccepted);

    return () => {
      socket.off("videoCallRequest", handleVideoRequest);

      socket.off("videoCallAccepted", handleVideoAccepted);
    };
  }, [socket, currentUserId, chatUser, userId, navigate]);

  // ==============================
  // RECEIVE MESSAGE
  // FIX DUPLICATES
  // ==============================
  useEffect(() => {
    if (!conversationId || !socket) return;

    socket.emit("joinRoom", conversationId);

    const handleReceiveMessage = (data) => {
      setMessages((prev) => {
        const exists = prev.some((msg) => msg._id && msg._id === data._id);

        if (exists) return prev;

        return [...prev, data];
      });
    };

    socket.off("receiveMessage");

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [conversationId, socket]);

  // ==============================
  // SEND MESSAGE
  // ==============================
  const sendMessage = () => {
    if (!message.trim() || !socket || !conversationId) return;

    socket.emit("sendMessage", {
      conversationId,
      sender: currentUserId,
      text: message,
    });

    setMessage("");
  };

  // ==============================
  // VIDEO CALL BUTTON
  // ==============================
  const handleVideoCall = () => {
    if (!socket) return;

    socket.emit("videoCallRequest", {
      to: userId,
      from: currentUserId,
      name: chatUser?.name,
    });
  };

  if (!currentUserId || !conversationId) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="h-screen w-screen bg-[#0b141a] flex flex-col">
      {/* HEADER */}
      <div className="h-16 bg-[#202c33] flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white">
            {chatUser?.name?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <h2 className="text-white font-semibold">{chatUser?.name}</h2>

            <p className="text-gray-400 text-xs">Online</p>
          </div>
        </div>

        <button onClick={handleVideoCall} className="text-xl">
          🎥
        </button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div className="bg-[#202c33] text-white px-4 py-2 rounded-xl">
              {msg.text}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="h-20 bg-[#202c33] flex gap-4 px-6 items-center">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 bg-[#2a3942] text-white px-4 py-3 rounded-full"
          placeholder="Type message"
        />

        <button
          onClick={sendMessage}
          className="bg-green-600 px-6 py-2 rounded-full text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}
