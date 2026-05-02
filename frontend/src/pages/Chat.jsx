// <<<<<<< HEAD
// /**
//  * Chat.jsx — updated
//  * Only change from original: 🎥 button now navigates to /video-call/:userId
//  * All chat socket logic is unchanged.
//  * WebRTC signaling is handled globally via SocketContext + VideoCallPage.
//  */

// import { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";
// import axios from "axios";

// const SOCKET_URL = "http://localhost:5000";

// export default function Chat() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
// =======
// import { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { io } from "socket.io-client";
// import axios from "axios";

// export default function Chat() {
//   const { userId } = useParams(); // other user id
// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f

//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [conversationId, setConversationId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [socket, setSocket] = useState(null);
//   const messagesEndRef = useRef(null);
//   const [chatUser, setChatUser] = useState(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     if (!userId) return;
// <<<<<<< HEAD
//     const fetchUser = async () => {
//       try {
//         const res = await fetch(`${SOCKET_URL}/api/users/${userId}`);
// =======

//     const fetchUser = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/api/users/${userId}`);
// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//         const data = await res.json();
//         setChatUser(data);
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       }
//     };
// <<<<<<< HEAD
//     fetchUser();
//   }, [userId]);

// =======

//     fetchUser();
//   }, [userId]);

//   // Load logged in user
// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       const parsedUser = JSON.parse(storedUser);
//       setCurrentUserId(parsedUser.id);
//     }
//   }, []);

// <<<<<<< HEAD
//   useEffect(() => {
//     if (!currentUserId || !userId) return;
//     const createConversation = async () => {
//       try {
//         const res = await axios.post(`${SOCKET_URL}/api/conversation`, {
//           senderId: currentUserId,
//           receiverId: userId,
//         });
// =======
//   // 🔥 Create or Get Conversation
//   useEffect(() => {
//     if (!currentUserId || !userId) return;

//     const createConversation = async () => {
//       try {
//         const res = await axios.post("http://localhost:5000/api/conversation", {
//           senderId: currentUserId,
//           receiverId: userId,
//         });

// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//         setConversationId(res.data._id);
//       } catch (error) {
//         console.log("Conversation error:", error);
//       }
//     };
// <<<<<<< HEAD
//     createConversation();
//   }, [currentUserId, userId]);

//   useEffect(() => {
//     if (!conversationId) return;
//     const loadMessages = async () => {
//       try {
//         const res = await axios.get(`${SOCKET_URL}/api/message/${conversationId}`);
// =======

//     createConversation();
//   }, [currentUserId, userId]);

//   // 🔥 Setup Socket After conversationId exists
//   useEffect(() => {
//     if (!conversationId) return;

//     const loadMessages = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/message/${conversationId}`,
//         );
// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//         setMessages(res.data);
//       } catch (error) {
//         console.log("Load messages error:", error);
//       }
//     };
// <<<<<<< HEAD
//     loadMessages();

//     const newSocket = io(SOCKET_URL);
//     setSocket(newSocket);
//     newSocket.emit("joinRoom", conversationId);
//     newSocket.on("receiveMessage", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });
//     return () => { newSocket.disconnect(); };
// =======

//     loadMessages();

//     const newSocket = io("http://localhost:5000");
//     setSocket(newSocket);

//     newSocket.emit("joinRoom", conversationId);

//     newSocket.on("receiveMessage", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     return () => {
//       newSocket.disconnect();
//     };
// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//   }, [conversationId]);

//   const sendMessage = () => {
//     if (!message.trim() || !socket || !conversationId) return;
// <<<<<<< HEAD
// =======

// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//     socket.emit("sendMessage", {
//       conversationId,
//       sender: currentUserId,
//       text: message,
//     });
// <<<<<<< HEAD
//     setMessage("");
//   };

//   // ── Navigate to full-screen video call page ──────────────────────────────
//   const handleVideoCall = () => {
//     navigate(`/video-call/${userId}`, {
//       state: { remoteName: chatUser?.name || userId },
//     });
// =======

//     setMessage("");
// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//   };

//   if (!currentUserId || !conversationId) {
//     return <div className="text-white p-10">Loading...</div>;
//   }

//   return (
//     <div className="h-screen w-screen bg-[#0b141a] flex flex-col">
// <<<<<<< HEAD
//       {/* HEADER */}
//       <div className="h-16 bg-[#202c33] flex items-center justify-between px-6 shadow-md">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
//             {chatUser?.name?.charAt(0)?.toUpperCase() || userId?.charAt(0)?.toUpperCase()}
// =======
//       {/* ===== HEADER ===== */}
//       <div className="h-16 bg-[#202c33] flex items-center justify-between px-6 shadow-md">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
//             {userId?.charAt(0).toUpperCase()}
// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//           </div>
//           <div>
//             <h2 className="text-white font-semibold text-lg">
//               {chatUser ? chatUser.name : "Loading..."}
//             </h2>
//             <p className="text-gray-400 text-xs">Online</p>
//           </div>
//         </div>

// <<<<<<< HEAD
//         <div className="flex gap-4 text-gray-400">
//           {/* ✅ Video call button */}
//           <button
//             onClick={handleVideoCall}
//             title="Start video call"
//             className="hover:text-white transition text-xl"
//           >
//             🎥
//           </button>
//           <button className="hover:text-white transition">&#8942;</button>
//         </div>
//       </div>

//       {/* MESSAGE AREA */}
// =======
//         {/* Future buttons section */}
//         <div className="flex gap-4 text-gray-400">
//           <button className="hover:text-white transition">📞</button>
//           <button className="hover:text-white transition">🎥</button>
//           <button className="hover:text-white transition">⋮</button>
//         </div>
//       </div>

//       {/* ===== MESSAGE AREA ===== */}
// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//       <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0b141a]">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               msg.sender === currentUserId ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`px-4 py-2 rounded-2xl max-w-sm break-words shadow-md ${
//                 msg.sender === currentUserId
//                   ? "bg-[#005c4b] text-white rounded-br-none"
//                   : "bg-[#202c33] text-white rounded-bl-none"
//               }`}
//             >
//               <p className="text-sm">{msg.text}</p>
//               <p className="text-[10px] text-gray-300 mt-1 text-right">
//                 {msg.time}
//               </p>
//             </div>
//           </div>
//         ))}
// <<<<<<< HEAD
//         <div ref={messagesEndRef} />
//       </div>

//       {/* INPUT AREA */}
// =======

//         <div ref={messagesEndRef} />
//       </div>

//       {/* ===== INPUT AREA ===== */}
// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//       <div className="h-20 bg-[#202c33] flex items-center px-6 gap-4">
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           className="flex-1 bg-[#2a3942] text-white px-4 py-3 rounded-full outline-none"
//           placeholder="Type a message"
//         />
// <<<<<<< HEAD
// =======

// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//         <button
//           onClick={sendMessage}
//           className="bg-[#00a884] hover:bg-[#019875] px-6 py-2 rounded-full text-white font-medium transition"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";
// import axios from "axios";

// const SOCKET_URL = "http://localhost:5000";

// export default function Chat() {
//   const { userId } = useParams();
//   const navigate = useNavigate();

//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [conversationId, setConversationId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [socket, setSocket] = useState(null);
//   const messagesEndRef = useRef(null);
//   const [chatUser, setChatUser] = useState(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     if (!userId) return;
//     const fetchUser = async () => {
//       try {
//         const res = await fetch(`${SOCKET_URL}/api/users/${userId}`);
//         const data = await res.json();
//         setChatUser(data);
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       }
//     };
//     fetchUser();
//   }, [userId]);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       const parsedUser = JSON.parse(storedUser);
//       setCurrentUserId(parsedUser.id);
//     }
//   }, []);

//   useEffect(() => {
//     if (!currentUserId || !userId) return;
//     const createConversation = async () => {
//       try {
//         const res = await axios.post(`${SOCKET_URL}/api/conversation`, {
//           senderId: currentUserId,
//           receiverId: userId,
//         });
//         setConversationId(res.data._id);
//       } catch (error) {
//         console.log("Conversation error:", error);
//       }
//     };
//     createConversation();
//   }, [currentUserId, userId]);

//   useEffect(() => {
//     if (!conversationId) return;
//     const loadMessages = async () => {
//       try {
//         const res = await axios.get(`${SOCKET_URL}/api/message/${conversationId}`);
//         setMessages(res.data);
//       } catch (error) {
//         console.log("Load messages error:", error);
//       }
//     };
//     loadMessages();

//     const newSocket = io(SOCKET_URL);
//     setSocket(newSocket);
//     newSocket.emit("joinRoom", conversationId);
//     newSocket.on("receiveMessage", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });
//     return () => { newSocket.disconnect(); };
//   }, [conversationId]);

//   const sendMessage = () => {
//     if (!message.trim() || !socket || !conversationId) return;
//     socket.emit("sendMessage", {
//       conversationId,
//       sender: currentUserId,
//       text: message,
//     });
//     setMessage("");
//   };

//   const handleVideoCall = () => {
//     navigate(`/video-call/${userId}`, {
//       state: { remoteName: chatUser?.name || userId },
//     });
//   };

//   if (!currentUserId || !conversationId) {
//     return <div className="text-white p-10">Loading...</div>;
//   }

//   return (
//     <div className="h-screen w-screen bg-[#0b141a] flex flex-col">
//       {/* HEADER */}
//       <div className="h-16 bg-[#202c33] flex items-center justify-between px-6 shadow-md">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
//             {chatUser?.name?.charAt(0)?.toUpperCase() || userId?.charAt(0)?.toUpperCase()}
//           </div>
//           <div>
//             <h2 className="text-white font-semibold text-lg">
//               {chatUser ? chatUser.name : "Loading..."}
//             </h2>
//             <p className="text-gray-400 text-xs">Online</p>
//           </div>
//         </div>

//         <div className="flex gap-4 text-gray-400">
//           <button
//             onClick={handleVideoCall}
//             title="Start video call"
//             className="hover:text-white transition text-xl"
//           >
//             🎥
//           </button>
//           <button className="hover:text-white transition">&#8942;</button>
//         </div>
//       </div>

//       {/* MESSAGE AREA */}
//       <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0b141a]">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex ${msg.sender === currentUserId ? "justify-end" : "justify-start"}`}
//           >
//             <div
//               className={`px-4 py-2 rounded-2xl max-w-sm break-words shadow-md ${
//                 msg.sender === currentUserId
//                   ? "bg-[#005c4b] text-white rounded-br-none"
//                   : "bg-[#202c33] text-white rounded-bl-none"
//               }`}
//             >
//               <p className="text-sm">{msg.text}</p>
//               <p className="text-[10px] text-gray-300 mt-1 text-right">
//                 {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
//               </p>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* INPUT AREA */}
//       <div className="h-20 bg-[#202c33] flex items-center px-6 gap-4">
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           className="flex-1 bg-[#2a3942] text-white px-4 py-3 rounded-full outline-none"
//           placeholder="Type a message"
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-[#00a884] hover:bg-[#019875] px-6 py-2 rounded-full text-white font-medium transition"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }


// <<<<<<< HEAD
// /**
//  * Chat.jsx — updated
//  * Only change from original: 🎥 button now navigates to /video-call/:userId
//  * All chat socket logic is unchanged.
//  * WebRTC signaling is handled globally via SocketContext + VideoCallPage.
//  */

// import { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";
// import axios from "axios";

// const SOCKET_URL = "http://localhost:5000";

// export default function Chat() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
// =======
// import { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { io } from "socket.io-client";
// import axios from "axios";

// export default function Chat() {
//   const { userId } = useParams(); // other user id
// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f

//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [conversationId, setConversationId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [socket, setSocket] = useState(null);
//   const messagesEndRef = useRef(null);
//   const [chatUser, setChatUser] = useState(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     if (!userId) return;
// <<<<<<< HEAD
//     const fetchUser = async () => {
//       try {
//         const res = await fetch(`${SOCKET_URL}/api/users/${userId}`);
// =======

//     const fetchUser = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/api/users/${userId}`);
// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//         const data = await res.json();
//         setChatUser(data);
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       }
//     };
// <<<<<<< HEAD
//     fetchUser();
//   }, [userId]);

// =======

//     fetchUser();
//   }, [userId]);

//   // Load logged in user
// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       const parsedUser = JSON.parse(storedUser);
//       setCurrentUserId(parsedUser.id);
//     }
//   }, []);

// <<<<<<< HEAD
//   useEffect(() => {
//     if (!currentUserId || !userId) return;
//     const createConversation = async () => {
//       try {
//         const res = await axios.post(`${SOCKET_URL}/api/conversation`, {
//           senderId: currentUserId,
//           receiverId: userId,
//         });
// =======
//   // 🔥 Create or Get Conversation
//   useEffect(() => {
//     if (!currentUserId || !userId) return;

//     const createConversation = async () => {
//       try {
//         const res = await axios.post("http://localhost:5000/api/conversation", {
//           senderId: currentUserId,
//           receiverId: userId,
//         });

// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//         setConversationId(res.data._id);
//       } catch (error) {
//         console.log("Conversation error:", error);
//       }
//     };
// <<<<<<< HEAD
//     createConversation();
//   }, [currentUserId, userId]);

//   useEffect(() => {
//     if (!conversationId) return;
//     const loadMessages = async () => {
//       try {
//         const res = await axios.get(`${SOCKET_URL}/api/message/${conversationId}`);
// =======

//     createConversation();
//   }, [currentUserId, userId]);

//   // 🔥 Setup Socket After conversationId exists
//   useEffect(() => {
//     if (!conversationId) return;

//     const loadMessages = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/message/${conversationId}`,
//         );
// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//         setMessages(res.data);
//       } catch (error) {
//         console.log("Load messages error:", error);
//       }
//     };
// <<<<<<< HEAD
//     loadMessages();

//     const newSocket = io(SOCKET_URL);
//     setSocket(newSocket);
//     newSocket.emit("joinRoom", conversationId);
//     newSocket.on("receiveMessage", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });
//     return () => { newSocket.disconnect(); };
// =======

//     loadMessages();

//     const newSocket = io("http://localhost:5000");
//     setSocket(newSocket);

//     newSocket.emit("joinRoom", conversationId);

//     newSocket.on("receiveMessage", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     return () => {
//       newSocket.disconnect();
//     };
// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//   }, [conversationId]);

//   const sendMessage = () => {
//     if (!message.trim() || !socket || !conversationId) return;
// <<<<<<< HEAD
// =======

// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//     socket.emit("sendMessage", {
//       conversationId,
//       sender: currentUserId,
//       text: message,
//     });
// <<<<<<< HEAD
//     setMessage("");
//   };

//   // ── Navigate to full-screen video call page ──────────────────────────────
//   const handleVideoCall = () => {
//     navigate(`/video-call/${userId}`, {
//       state: { remoteName: chatUser?.name || userId },
//     });
// =======

//     setMessage("");
// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//   };

//   if (!currentUserId || !conversationId) {
//     return <div className="text-white p-10">Loading...</div>;
//   }

//   return (
//     <div className="h-screen w-screen bg-[#0b141a] flex flex-col">
// <<<<<<< HEAD
//       {/* HEADER */}
//       <div className="h-16 bg-[#202c33] flex items-center justify-between px-6 shadow-md">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
//             {chatUser?.name?.charAt(0)?.toUpperCase() || userId?.charAt(0)?.toUpperCase()}
// =======
//       {/* ===== HEADER ===== */}
//       <div className="h-16 bg-[#202c33] flex items-center justify-between px-6 shadow-md">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
//             {userId?.charAt(0).toUpperCase()}
// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//           </div>
//           <div>
//             <h2 className="text-white font-semibold text-lg">
//               {chatUser ? chatUser.name : "Loading..."}
//             </h2>
//             <p className="text-gray-400 text-xs">Online</p>
//           </div>
//         </div>

// <<<<<<< HEAD
//         <div className="flex gap-4 text-gray-400">
//           {/* ✅ Video call button */}
//           <button
//             onClick={handleVideoCall}
//             title="Start video call"
//             className="hover:text-white transition text-xl"
//           >
//             🎥
//           </button>
//           <button className="hover:text-white transition">&#8942;</button>
//         </div>
//       </div>

//       {/* MESSAGE AREA */}
// =======
//         {/* Future buttons section */}
//         <div className="flex gap-4 text-gray-400">
//           <button className="hover:text-white transition">📞</button>
//           <button className="hover:text-white transition">🎥</button>
//           <button className="hover:text-white transition">⋮</button>
//         </div>
//       </div>

//       {/* ===== MESSAGE AREA ===== */}
// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//       <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0b141a]">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               msg.sender === currentUserId ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`px-4 py-2 rounded-2xl max-w-sm break-words shadow-md ${
//                 msg.sender === currentUserId
//                   ? "bg-[#005c4b] text-white rounded-br-none"
//                   : "bg-[#202c33] text-white rounded-bl-none"
//               }`}
//             >
//               <p className="text-sm">{msg.text}</p>
//               <p className="text-[10px] text-gray-300 mt-1 text-right">
//                 {msg.time}
//               </p>
//             </div>
//           </div>
//         ))}
// <<<<<<< HEAD
//         <div ref={messagesEndRef} />
//       </div>

//       {/* INPUT AREA */}
// =======

//         <div ref={messagesEndRef} />
//       </div>

//       {/* ===== INPUT AREA ===== */}
// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//       <div className="h-20 bg-[#202c33] flex items-center px-6 gap-4">
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           className="flex-1 bg-[#2a3942] text-white px-4 py-3 rounded-full outline-none"
//           placeholder="Type a message"
//         />
// <<<<<<< HEAD
// =======

// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
//         <button
//           onClick={sendMessage}
//           className="bg-[#00a884] hover:bg-[#019875] px-6 py-2 rounded-full text-white font-medium transition"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../context/SocketContext";
const SOCKET_URL = "http://localhost:5000";

export default function Chat() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [currentUserId, setCurrentUserId] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  //const [socket, setSocket] = useState(null);
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

//   useEffect(() => {
//     if (!conversationId) return;
//     const loadMessages = async () => {
//       try {
//         const res = await axios.get(`${SOCKET_URL}/api/message/${conversationId}`);
//         setMessages(res.data);
//       } catch (error) {
//         console.log("Load messages error:", error);
//       }
//     };
//     loadMessages();

//  const newSocket = io(SOCKET_URL);
// setSocket(newSocket);

// // register user with socket server
// newSocket.emit("register", currentUserId);

// newSocket.emit("joinRoom", conversationId);

// /* CHAT MESSAGE LISTENER */
// newSocket.on("receiveMessage", (data) => {
//   setMessages((prev) => [...prev, data]);
// });

// /* VIDEO CALL REQUEST LISTENER */
// newSocket.on("videoCallRequest", (data) => {

//   const accept = window.confirm(`${data.name} wants to start a video call`);

//   if (accept) {

//     newSocket.emit("videoCallAccepted", {
//       to: data.from,
//       from: currentUserId
//     });

//     navigate(`/video-call/${data.from}`, {
//       state: { remoteName: data.name }
//     });

//   }

// });

// /* VIDEO CALL ACCEPTED LISTENER */
// newSocket.on("videoCallAccepted", (data) => {

//   navigate(`/video-call/${data.from}`, {
//     state: { remoteName: chatUser?.name || userId }
//   });

// });

// return () => {
//   newSocket.disconnect();
// };

// }, [conversationId, currentUserId]);
// useEffect(() => {

//   const newSocket = io(SOCKET_URL);
//   setSocket(newSocket);

//   newSocket.emit("register", currentUserId);

//   newSocket.on("videoCallRequest", (data) => {

//     const accept = window.confirm(`${data.name} wants to start a video call`);

//     if (accept) {
//       newSocket.emit("videoCallAccepted", {
//         to: data.from,
//         from: currentUserId
//       });

//       navigate(`/video-call/${data.from}`, {
//         state: { remoteName: data.name }
//       });
//     }

//   });

//   newSocket.on("videoCallAccepted", (data) => {

//     navigate(`/video-call/${data.from}`, {
//       state: { remoteName: chatUser?.name || userId }
//     });

//   });

//   return () => newSocket.disconnect();

// }, []);

useEffect(() => {
  if (!socket || !currentUserId) return;

  socket.on("videoCallRequest", (data) => {
    const accept = window.confirm(`${data.name} wants to start a video call`);

    if (accept) {
      socket.emit("videoCallAccepted", {
        to: data.from,
        from: currentUserId
      });

      navigate(`/video-call/${data.from}`, {
        state: { remoteName: data.name }
      });
    }
  });

  socket.on("videoCallAccepted", (data) => {
    navigate(`/video-call/${data.from}`, {
      state: { remoteName: chatUser?.name || userId }
    });
  });

  return () => {
    socket.off("videoCallRequest");
    socket.off("videoCallAccepted");
  };
}, [socket, currentUserId]);
useEffect(() => {
  if (!conversationId || !socket) return;

  socket.emit("joinRoom", conversationId);

  socket.on("receiveMessage", (data) => {
    setMessages((prev) => [...prev, data]);
  });

  return () => {
    socket.off("receiveMessage");
  };
}, [conversationId, socket]);

  const sendMessage = () => {
    if (!message.trim() || !socket || !conversationId) return;
    socket.emit("sendMessage", {
      conversationId,
      sender: currentUserId,
      text: message,
    });
    setMessage("");
  };

//   const handleVideoCall = () => {

//   if (!socket) return;

//   socket.emit("videoCallRequest", {
//     to: userId,
//     from: currentUserId,
//     name: chatUser?.name
//   });

// };
const handleVideoCall = () => {

  if (!socket) {
    console.log("Socket not ready");
    return;
  }

  console.log("Sending VC request to:", userId);

  socket.emit("videoCallRequest", {
    to: userId,
    from: currentUserId,
    name: chatUser?.name
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
            className={`flex ${msg.sender === currentUserId ? "justify-end" : "justify-start"}`}
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
                {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
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





// import { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";
// import axios from "axios";

// const SOCKET_URL = "http://localhost:5000";

// export default function Chat() {
//   const { userId } = useParams();
//   const navigate = useNavigate();

//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [conversationId, setConversationId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [socket, setSocket] = useState(null);
//   const messagesEndRef = useRef(null);
//   const [chatUser, setChatUser] = useState(null);
  
//   // Video call request states
//   const [isRequestingCall, setIsRequestingCall] = useState(false);
//   const [incomingVideoCallRequest, setIncomingVideoCallRequest] = useState(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     if (!userId) return;
//     const fetchUser = async () => {
//       try {
//         const res = await fetch(`${SOCKET_URL}/api/users/${userId}`);
//         const data = await res.json();
//         setChatUser(data);
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       }
//     };
//     fetchUser();
//   }, [userId]);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       const parsedUser = JSON.parse(storedUser);
//       setCurrentUserId(parsedUser.id);
//     }
//   }, []);

//   useEffect(() => {
//     if (!currentUserId || !userId) return;
//     const createConversation = async () => {
//       try {
//         const res = await axios.post(`${SOCKET_URL}/api/conversation`, {
//           senderId: currentUserId,
//           receiverId: userId,
//         });
//         setConversationId(res.data._id);
//       } catch (error) {
//         console.log("Conversation error:", error);
//       }
//     };
//     createConversation();
//   }, [currentUserId, userId]);

//   useEffect(() => {
//     if (!conversationId) return;
//     const loadMessages = async () => {
//       try {
//         const res = await axios.get(`${SOCKET_URL}/api/message/${conversationId}`);
//         setMessages(res.data);
//       } catch (error) {
//         console.log("Load messages error:", error);
//       }
//     };
//     loadMessages();

//     const newSocket = io(SOCKET_URL);
//     setSocket(newSocket);
    
//     // Register user for direct messaging
//     newSocket.emit("register", currentUserId);
    
//     // Join chat room
//     newSocket.emit("joinRoom", conversationId);
    
//     // Listen for chat messages
//     newSocket.on("receiveMessage", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     // Listen for incoming video call requests
//     newSocket.on("videoCallRequest", (data) => {
//       const { from, fromName } = data;
//       setIncomingVideoCallRequest({ from, fromName });
//     });

//     // Listen for video call acceptance
//     newSocket.on("videoCallAccepted", () => {
//       setIsRequestingCall(false);
//       navigate(`/video-call/${userId}`, {
//         state: { remoteName: chatUser?.name || userId },
//       });
//     });

//     // Listen for video call rejection
//     newSocket.on("videoCallRejected", () => {
//       setIsRequestingCall(false);
//       alert("Call request was declined");
//     });

//     // Listen for video call timeout
//     newSocket.on("videoCallTimeout", () => {
//       setIsRequestingCall(false);
//       alert("Call request timed out");
//     });

//     return () => { 
//       newSocket.disconnect(); 
//     };
//   }, [conversationId, currentUserId, navigate, userId, chatUser?.name]);

//   const sendMessage = () => {
//     if (!message.trim() || !socket || !conversationId) return;
//     socket.emit("sendMessage", {
//       conversationId,
//       sender: currentUserId,
//       text: message,
//     });
//     setMessage("");
//   };

//   const handleVideoCallRequest = () => {
//     if (!socket || isRequestingCall) return;
    
//     setIsRequestingCall(true);
//     socket.emit("videoCallRequest", {
//       to: userId,
//       from: currentUserId,
//       fromName: chatUser?.name || "User",
//     });

//     // Auto-cancel after 30 seconds
//     setTimeout(() => {
//       if (isRequestingCall) {
//         setIsRequestingCall(false);
//       }
//     }, 30000);
//   };

//   const acceptVideoCall = () => {
//     if (!socket || !incomingVideoCallRequest) return;
    
//     socket.emit("videoCallAccepted", {
//       to: incomingVideoCallRequest.from,
//       from: currentUserId,
//     });
    
//     setIncomingVideoCallRequest(null);
//     navigate(`/video-call/${incomingVideoCallRequest.from}`, {
//       state: { remoteName: incomingVideoCallRequest.fromName },
//     });
//   };

//   const rejectVideoCall = () => {
//     if (!socket || !incomingVideoCallRequest) return;
    
//     socket.emit("videoCallRejected", {
//       to: incomingVideoCallRequest.from,
//       from: currentUserId,
//     });
    
//     setIncomingVideoCallRequest(null);
//   };

//   if (!currentUserId || !conversationId) {
//     return <div className="text-white p-10">Loading...</div>;
//   }

//   return (
//     <div className="h-screen w-screen bg-[#0b141a] flex flex-col">
//       {/* HEADER */}
//       <div className="h-16 bg-[#202c33] flex items-center justify-between px-6 shadow-md">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
//             {chatUser?.name?.charAt(0)?.toUpperCase() || userId?.charAt(0)?.toUpperCase()}
//           </div>
//           <div>
//             <h2 className="text-white font-semibold text-lg">
//               {chatUser ? chatUser.name : "Loading..."}
//             </h2>
//             <p className="text-gray-400 text-xs">
//               {isRequestingCall ? "Requesting video call..." : "Online"}
//             </p>
//           </div>
//         </div>

//         <div className="flex gap-4 text-gray-400">
//           <button
//             onClick={handleVideoCallRequest}
//             disabled={isRequestingCall}
//             title={isRequestingCall ? "Waiting for response..." : "Start video call"}
//             className={`hover:text-white transition text-xl ${
//               isRequestingCall ? "opacity-50 cursor-not-allowed animate-pulse" : ""
//             }`}
//           >
//             🎥
//           </button>
//           <button className="hover:text-white transition">&#8942;</button>
//         </div>
//       </div>

//       {/* INCOMING VIDEO CALL REQUEST POPUP */}
//       {incomingVideoCallRequest && (
//         <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
//           <div className="bg-[#202c33] rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
//             <div className="text-center">
//               <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
//                 {incomingVideoCallRequest.fromName?.charAt(0)?.toUpperCase()}
//               </div>
//               <h3 className="text-white text-xl font-semibold mb-2">
//                 Incoming Video Call
//               </h3>
//               <p className="text-gray-400 mb-6">
//                 {incomingVideoCallRequest.fromName} is calling you
//               </p>
//               <div className="flex gap-4 justify-center">
//                 <button
//                   onClick={rejectVideoCall}
//                   className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-medium transition flex items-center gap-2"
//                 >
//                   <span>📵</span> Decline
//                 </button>
//                 <button
//                   onClick={acceptVideoCall}
//                   className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full font-medium transition flex items-center gap-2"
//                 >
//                   <span>🎥</span> Accept
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* MESSAGE AREA */}
//       <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0b141a]">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex ${msg.sender === currentUserId ? "justify-end" : "justify-start"}`}
//           >
//             <div
//               className={`px-4 py-2 rounded-2xl max-w-sm break-words shadow-md ${
//                 msg.sender === currentUserId
//                   ? "bg-[#005c4b] text-white rounded-br-none"
//                   : "bg-[#202c33] text-white rounded-bl-none"
//               }`}
//             >
//               <p className="text-sm">{msg.text}</p>
//               <p className="text-[10px] text-gray-300 mt-1 text-right">
//                 {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
//               </p>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* INPUT AREA */}
//       <div className="h-20 bg-[#202c33] flex items-center px-6 gap-4">
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           className="flex-1 bg-[#2a3942] text-white px-4 py-3 rounded-full outline-none"
//           placeholder="Type a message"
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-[#00a884] hover:bg-[#019875] px-6 py-2 rounded-full text-white font-medium transition"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }
