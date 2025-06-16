import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";

import { GameManager } from "./games/GameManager.js";

dotenv.config();

// --- Initialize Express ---
const app = express();
app.use(cors());
app.use(express.json());

// --- Security & Rate Limiting ---
app.use(helmet());
app.use(rateLimit({ windowMs: 1 * 60 * 1000, max: 100 }));

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// --- API Routes ---
app.use("/api/v1/auth", authRoutes); // Login, Register, Profile
app.use("/api/v1/leaderboard", leaderboardRoutes); // Top players
app.use("/api/v1/history", historyRoutes); // Match history for profile

// --- HTTP + WebSocket Server ---
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const gameManager = new GameManager();

wss.on("connection", (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const token = url.searchParams.get("token");

  let user = null;
  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Authenticated user connected:", user.username);
    } catch (err) {
      console.error("❌ Invalid token:", err.message);
      return ws.close(1008, "Invalid token");
    }
  } else {
    console.log("🔓 Anonymous user connected");
  }

  ws.user = user;
  ws.isAuthenticated = !!user;

  gameManager.addUser(ws);

  ws.on("close", () => {
    console.log(`🔌 User ${user?.username || "anonymous"} disconnected`);
    gameManager.removeUser(ws);
  });

  ws.on("error", console.error);
});

// --- Start Server ---
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
