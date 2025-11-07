import express from "express";
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} from "../controllers/leaveControllers.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Employee routes
router.post("/apply", isAuthenticated, applyLeave);
router.get("/my-leaves", isAuthenticated, getMyLeaves);

// Admin routes (important: run isAuthenticated FIRST)
router.get("/all", isAuthenticated, isAdmin, getAllLeaves);
router.put("/update/:id", isAuthenticated, isAdmin, updateLeaveStatus);

export default router;
