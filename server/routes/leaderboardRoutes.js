import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const topUsers = await User.find({}, "username wins gamesPlayed")
      .sort({ wins: -1 })
      .limit(10)
      .lean();

    const leaderboard = topUsers.map((user) => ({
      ...user,
      winRate:
        user.gamesPlayed > 0
          ? Math.round((user.wins / user.gamesPlayed) * 100)
          : 0,
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard fetch error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
