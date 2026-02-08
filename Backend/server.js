import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import matchRequestRoutes from "./routes/matchRequestRoutes.js"; // ✅ your work
import searchRoutes from "./routes/searchRoutes.js"; // ✅ teammate work

import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/skill", skillRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/match-request", matchRequestRoutes); // ✅ keep
app.use("/api", searchRoutes); // ✅ keep

app.get("/", (req, res) => {
  res.send("SkillSwap backend running");
});

// Error middleware (LAST)
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, "127.0.0.1", () => {
    console.log(`🚀 Server listening on http://127.0.0.1:${PORT}`);
  });
};

startServer();

