import express from "express";
import { profileByUsername } from "../controllers/authController.js";

const router = express.Router();

router.get("/profile/:username", profileByUsername);

export default router;
