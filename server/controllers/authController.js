import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Game from "../models/Game.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET not set in environment");

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Email or username already exists" });
    }
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("Incorrect password");
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "2d",
    });

    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const username = req.user.username;
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ error: "User not found" });

    const { wins, gamesPlayed, email } = user;

    // Get all game records for the user
    const allGames = await Game.find({
      $or: [{ player1: username }, { player2: username }],
    }).sort({ createdAt: -1 });

    // Recent Matches (limit 10)
    const recentMatches = allGames.slice(0, 10).map((g) => {
      const result =
        g.winner === username ? "Win" : g.winner === "draw" ? "Draw" : "Loss";
      return {
        id: g._id,
        date: g.createdAt,
        game: g.gameType,
        opponent: g.player1 === username ? g.player2 : g.player1,
        result,
        timeTaken: g.timeTaken || 0,
      };
    });

    // Per-game stats
    const gameStats = {};
    for (let game of allGames) {
      const type = game.gameType;
      if (!gameStats[type]) gameStats[type] = { wins: 0, losses: 0, draws: 0 };

      if (game.winner === "draw") gameStats[type].draws++;
      else if (game.winner === username) gameStats[type].wins++;
      else gameStats[type].losses++;
    }

    const perGameArray = Object.entries(gameStats).map(([name, stats]) => ({
      name,
      ...stats,
    }));

    // Longest Win Streak
    let maxStreak = 0,
      currentStreak = 0;
    for (let game of allGames) {
      if (game.winner === username) currentStreak++;
      else currentStreak = 0;
      maxStreak = Math.max(maxStreak, currentStreak);
    }

    // Favorite Game (most played)
    const mostPlayed = Object.entries(gameStats).reduce(
      (a, b) =>
        a[1].wins + a[1].losses + a[1].draws >
        b[1].wins + b[1].losses + b[1].draws
          ? a
          : b,
      ["", { wins: 0, losses: 0, draws: 0 }]
    );

    // Badges
    const badges = [];
    if (wins >= 1) badges.push("first_win");
    if ((gameStats["Sudoku"]?.wins || 0) >= 5) badges.push("5_sudoku");
    if ((gameStats["Chess"]?.wins || 0) >= 10) badges.push("10_chess");
    if (
      allGames.some(
        (g) => g.winner === username && g.timeTaken && g.timeTaken < 60
      )
    ) {
      badges.push("fast_thinker");
    }

    res.json({
      username,
      email,
      wins,
      gamesPlayed,
      longestWinStreak: maxStreak,
      favoriteGame: mostPlayed[0] || "N/A",
      games: perGameArray,
      badges,
      recentMatches,
    });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const profileByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      username: user.username,
      wins: user.wins || 0,
      gamesPlayed: user.gamesPlayed || 0,
    });
  } catch (error) {
    console.error("Profile fetch error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete account" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Update password error:", err);
    res.status(500).json({ error: "Failed to update password" });
  }
};

export const updateUsername = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newUsername } = req.body;

    if (!newUsername || newUsername.length < 3) {
      return res
        .status(400)
        .json({ error: "Username must be at least 3 characters long." });
    }

    const existingUser = await User.findOne({ username: newUsername });
    if (existingUser) {
      return res.status(409).json({ error: "Username already taken." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username: newUsername },
      { new: true }
    );

    res.status(200).json({
      message: "Username updated successfully",
      username: updatedUser.username,
    });
  } catch (err) {
    console.error("Error updating username:", err);
    res.status(500).json({ error: "Failed to update username" });
  }
};
