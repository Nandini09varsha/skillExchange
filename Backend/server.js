import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import matchRequestRoutes from "./routes/matchRequestRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";

import { errorHandler } from "./middleware/errorMiddleware.js";
import Message from "./models/Message.js";
import Conversation from "./models/Conversation.js";
import messageRoutes from "./routes/messageRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import { protect } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
const server = http.createServer(app); // ✅ create HTTP server

// ✅ Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend port
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/skill", skillRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/match-request", matchRequestRoutes);
app.use("/api", searchRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/", (req, res) => {
  res.send("SkillSwap backend running");
});

// 🔥 SOCKET LOGIC
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log("Joined room:", roomId);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { conversationId, sender, text } = data;

      // 1️⃣ Save message in DB
      const newMessage = await Message.create({
        conversationId,
        sender,
        text,
      });

      // 2️⃣ Update last message in conversation
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: text,
      });

      // 3️⃣ Emit to room
      io.to(conversationId).emit("receiveMessage", newMessage);
    } catch (error) {
      console.log("Message save error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Error middleware (LAST)
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  await connectDB();

  server.listen(PORT, "127.0.0.1", () => {
    console.log(`🚀 Server listening on http://127.0.0.1:${PORT}`);
  });
};

startServer();
