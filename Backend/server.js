import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import matchRequestRoutes from "./routes/matchRequestRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import callHistoryRoutes from "./routes/callHistoryRoutes.js";

import { errorHandler } from "./middleware/errorMiddleware.js";
import Message from "./models/Message.js";
import Conversation from "./models/Conversation.js";
import messageRoutes from "./routes/messageRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import CallHistory from "./models/CallHistory.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
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
app.use("/api/notifications", notificationRoutes);
app.use("/api/calls", callHistoryRoutes);

app.get("/", (req, res) => {
  res.send("SkillSwap backend running");
});

// Socket maps
const userSocketMap = {};
const callSocketMap = {};

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register", (userId) => {
    userSocketMap[userId] = socket.id;
    console.log(`Registered userId=${userId} -> socketId=${socket.id}`);
  });

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log("Joined chat room:", roomId);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { conversationId, sender, text } = data;
      const newMessage = await Message.create({ conversationId, sender, text });
      await Conversation.findByIdAndUpdate(conversationId, { lastMessage: text });
      io.to(conversationId).emit("receiveMessage", newMessage);
    } catch (error) {
      console.log("Message save error:", error);
    }
  });

  socket.on("call-user", async ({ to, from, fromName, offer }) => {
    const targetSocketId = userSocketMap[to];
    const callId = uuidv4();

    try {
      const record = await CallHistory.create({
        caller: from,
        callee: to,
        callId,
        status: "calling",
      });
      callSocketMap[callId] = {
        callerId: from,
        calleeId: to,
        dbId: record._id,
      };
    } catch (dbErr) {
      console.error("CallHistory create error:", dbErr);
    }

    if (targetSocketId) {
      io.to(targetSocketId).emit("incoming-call", { from, fromName, callId, offer });
      console.log(`Call (${callId}): ${from} -> ${to}`);
    } else {
      socket.emit("call-failed", { callId, reason: "User is offline or unavailable." });
      try {
        await CallHistory.findOneAndUpdate({ callId }, { status: "missed" });
      } catch (_) {}
    }
  });

  socket.on("answer-call", async ({ to, callId, answer }) => {
    const targetSocketId = userSocketMap[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("call-answered", { callId, answer });
    }
    try {
      await CallHistory.findOneAndUpdate(
        { callId },
        { status: "active", startedAt: new Date() }
      );
    } catch (dbErr) {
      console.error("CallHistory update (answer) error:", dbErr);
    }
  });

  socket.on("ice-candidate", ({ to, candidate }) => {
    const targetSocketId = userSocketMap[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("ice-candidate", { candidate });
    }
  });

  socket.on("end-call", async ({ to, callId, hadScreenShare }) => {
    const targetSocketId = userSocketMap[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("call-ended", { callId });
    }
    try {
      const record = await CallHistory.findOne({ callId });
      if (record) {
        const endedAt = new Date();
        const duration = record.startedAt
          ? Math.floor((endedAt - new Date(record.startedAt)) / 1000)
          : 0;
        await CallHistory.findOneAndUpdate(
          { callId },
          { status: "ended", endedAt, duration, hadScreenShare: hadScreenShare || false }
        );
      }
    } catch (dbErr) {
      console.error("CallHistory update (end) error:", dbErr);
    }
    delete callSocketMap[callId];
  });

  socket.on("reject-call", async ({ to, callId }) => {
    const targetSocketId = userSocketMap[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("call-rejected", { callId });
    }
    try {
      await CallHistory.findOneAndUpdate({ callId }, { status: "rejected" });
    } catch (dbErr) {
      console.error("CallHistory update (reject) error:", dbErr);
    }
    delete callSocketMap[callId];
  });

  socket.on("disconnect", async () => {
    let disconnectedUserId = null;
    for (const [uid, sid] of Object.entries(userSocketMap)) {
      if (sid === socket.id) {
        disconnectedUserId = uid;
        delete userSocketMap[uid];
        break;
      }
    }

    if (disconnectedUserId) {
      for (const [callId, meta] of Object.entries(callSocketMap)) {
        if (meta.callerId === disconnectedUserId || meta.calleeId === disconnectedUserId) {
          const otherId = meta.callerId === disconnectedUserId ? meta.calleeId : meta.callerId;
          const otherSocket = userSocketMap[otherId];
          if (otherSocket) {
            io.to(otherSocket).emit("call-ended", { callId, reason: "Peer disconnected" });
          }
          try {
            const record = await CallHistory.findOne({ callId });
            if (record && record.status === "active") {
              const endedAt = new Date();
              const duration = record.startedAt
                ? Math.floor((endedAt - new Date(record.startedAt)) / 1000)
                : 0;
              await CallHistory.findOneAndUpdate(
                { callId },
                { status: "ended", endedAt, duration }
              );
            }
          } catch (_) {}
          delete callSocketMap[callId];
        }
      }
    }

    console.log("Socket disconnected:", socket.id);
  });
});

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  await connectDB();
  server.listen(PORT, "127.0.0.1", () => {
    console.log(`🚀 Server listening on http://127.0.0.1:${PORT}`);
  });
};

startServer();