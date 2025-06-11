import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const topUsers = await User.find().sort({ wins: -1 }).limit(10);
  res.json(topUsers);
});

export default router;
