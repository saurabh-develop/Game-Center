import express from "express";
import { protect } from "../middlewares/authMiddleWare.js";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const client = new MongoClient(process.env.MONGO_URI);
await client.connect();
const db = client.db(process.env.DB_NAME || "game_center");

router.get("/", protect, async (req, res) => {
  const games = await db
    .collection("game_history")
    .find({ username: req.user.username })
    .sort({ createdAt: -1 })
    .toArray();
  res.json(games);
});

export default router;
