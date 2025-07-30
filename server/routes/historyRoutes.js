import express from "express";
import { protect } from "../middlewares/authMiddleWare.js";
import User from "../models/User.js";
import { getDB } from "../utils/db.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username");
    if (!user) return res.status(404).json({ error: "User not found" });

    const username = user.username;
    const db = getDB();

    const games = await db
      .collection("game_history")
      .find({
        $or: [{ player1: username }, { player2: username }],
      })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    res.json(games);
  } catch (err) {
    console.error("Game history fetch error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
