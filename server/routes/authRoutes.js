import express from "express";
import {
  register,
  login,
  getProfile as profile,
  updateUsername,
  updatePassword,
  deleteAccount,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleWare.js";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);

// Protected profile + account settings
router.get("/profile", protect, profile);
router.put("/update-username", protect, updateUsername);
router.put("/update-password", protect, updatePassword);
router.delete("/delete-account", protect, deleteAccount);

export default router;
