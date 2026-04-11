import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
<<<<<<< HEAD
import { v4 as uuidv4 } from "uuid";
=======
>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import matchRequestRoutes from "./routes/matchRequestRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
<<<<<<< HEAD
import messageRoutes from "./routes/messageRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import callHistoryRoutes from "./routes/callHistoryRoutes.js";
=======
>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f

import { errorHandler } from "./middleware/errorMiddleware.js";
import Message from "./models/Message.js";
import Conversation from "./models/Conversation.js";
<<<<<<< HEAD
import CallHistory from "./models/CallHistory.js";
=======
import messageRoutes from "./routes/messageRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f

dotenv.config();

const app = express();
<<<<<<< HEAD
const server = http.createServer(app);

// ── Socket.IO ────────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
=======
const server = http.createServer(app); // ✅ create HTTP server

// ✅ Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend port
>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// ── REST Routes ──────────────────────────────────────────────────────────────
=======
// Routes
>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
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
<<<<<<< HEAD
app.use("/api/calls", callHistoryRoutes);   // ✅ NEW: call history REST API
=======
>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f

app.get("/", (req, res) => {
  res.send("SkillSwap backend running");
});

<<<<<<< HEAD
// ── Socket.IO ─────────────────────────────────────────────────────────────────
//
// userId  -> socketId   (for routing calls to the right peer)
// callId  -> CallHistory._id in DB  (for updating a live call record)
//
const userSocketMap = {};  // { userId: socketId }
const callSocketMap = {};  // { callId: { callerId, calleeId, dbId } }

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // ── Register: link userId to this socket so we can route calls ────────────
  socket.on("register", (userId) => {
    userSocketMap[userId] = socket.id;
    console.log(`Registered userId=${userId} -> socketId=${socket.id}`);
  });

  // ── Chat ──────────────────────────────────────────────────────────────────
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log("Joined chat room:", roomId);
=======
// 🔥 SOCKET LOGIC
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log("Joined room:", roomId);
>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { conversationId, sender, text } = data;
<<<<<<< HEAD
      const newMessage = await Message.create({ conversationId, sender, text });
      await Conversation.findByIdAndUpdate(conversationId, { lastMessage: text });
=======

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
>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
      io.to(conversationId).emit("receiveMessage", newMessage);
    } catch (error) {
      console.log("Message save error:", error);
    }
  });

<<<<<<< HEAD
  // ── WebRTC Signaling ───────────────────────────────────────────────────────

  /**
   * call-user
   * Emitted by caller. Finds callee's socket and forwards the offer.
   * Also creates a CallHistory document in MongoDB.
   */
  socket.on("call-user", async ({ to, from, fromName, offer }) => {
    const targetSocketId = userSocketMap[to];

    // Generate a unique ID for this call attempt
    const callId = uuidv4();

    // ── Persist call attempt to DB ─────────────────────────────────────────
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
      io.to(targetSocketId).emit("incoming-call", {
        from,
        fromName,
        callId,
        offer,
      });
      console.log(`Call (${callId}): ${from} -> ${to}`);
    } else {
      // Callee offline → immediately mark as missed
      socket.emit("call-failed", {
        callId,
        reason: "User is offline or unavailable.",
      });
      try {
        await CallHistory.findOneAndUpdate(
          { callId },
          { status: "missed" }
        );
      } catch (_) {}
    }
  });

  /**
   * answer-call
   * Emitted by callee. Forwards SDP answer back to caller.
   * Updates CallHistory: status → active, startedAt → now.
   */
  socket.on("answer-call", async ({ to, callId, answer }) => {
    const targetSocketId = userSocketMap[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("call-answered", { callId, answer });
    }
    // Update DB
    try {
      await CallHistory.findOneAndUpdate(
        { callId },
        { status: "active", startedAt: new Date() }
      );
    } catch (dbErr) {
      console.error("CallHistory update (answer) error:", dbErr);
    }
  });

  /**
   * ice-candidate
   * Relay ICE candidates between peers. Stateless.
   */
  socket.on("ice-candidate", ({ to, candidate }) => {
    const targetSocketId = userSocketMap[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("ice-candidate", { candidate });
    }
  });

  /**
   * end-call
   * Either peer ends the call. Notify the other side.
   * Updates CallHistory: status → ended, endedAt, duration.
   * Accepts optional hadScreenShare flag from frontend.
   */
  socket.on("end-call", async ({ to, callId, hadScreenShare }) => {
    const targetSocketId = userSocketMap[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("call-ended", { callId });
    }
    // Update DB with duration
    try {
      const record = await CallHistory.findOne({ callId });
      if (record) {
        const endedAt = new Date();
        const duration =
          record.startedAt
            ? Math.floor((endedAt - new Date(record.startedAt)) / 1000)
            : 0;
        await CallHistory.findOneAndUpdate(
          { callId },
          {
            status: "ended",
            endedAt,
            duration,
            hadScreenShare: hadScreenShare || false,
          }
        );
      }
    } catch (dbErr) {
      console.error("CallHistory update (end) error:", dbErr);
    }
    // Cleanup
    delete callSocketMap[callId];
  });

  /**
   * reject-call
   * Callee declines. Notify caller, update DB.
   */
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

  // ── Disconnect ────────────────────────────────────────────────────────────
  socket.on("disconnect", async () => {
    // Find which userId owned this socket
    let disconnectedUserId = null;
    for (const [uid, sid] of Object.entries(userSocketMap)) {
      if (sid === socket.id) {
        disconnectedUserId = uid;
        delete userSocketMap[uid];
        break;
      }
    }

    // If user was in a call, notify the other side and mark call as ended
    if (disconnectedUserId) {
      for (const [callId, meta] of Object.entries(callSocketMap)) {
        if (
          meta.callerId === disconnectedUserId ||
          meta.calleeId === disconnectedUserId
        ) {
          const otherId =
            meta.callerId === disconnectedUserId ? meta.calleeId : meta.callerId;
          const otherSocket = userSocketMap[otherId];
          if (otherSocket) {
            io.to(otherSocket).emit("call-ended", {
              callId,
              reason: "Peer disconnected",
            });
          }
          // Mark in DB
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

// ── Error middleware (always last) ────────────────────────────────────────────
=======
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Error middleware (LAST)
>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  await connectDB();
<<<<<<< HEAD
=======

>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
  server.listen(PORT, "127.0.0.1", () => {
    console.log(`🚀 Server listening on http://127.0.0.1:${PORT}`);
  });
};

startServer();
