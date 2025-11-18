import express from "express";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";
import {
  giveReward,
  getAllRewards,
  getMyRewards,
  getLeaderboard,
} from "../controllers/rewardController.js";

const router = express.Router();

// Employee
router.get("/my", isAuthenticated, getMyRewards);
router.get("/leaderboard", isAuthenticated, getLeaderboard);

// Admin
router.post("/give", isAuthenticated, isAdmin, giveReward);
router.get("/all", isAuthenticated, isAdmin, getAllRewards);

export default router;
