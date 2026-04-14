import express from "express";
import {
  markAttendance,
  getAttendanceByDate,
  checkIn,
  checkOut,
  getMyTodayStatus,
  getMyAttendance,
} from "../controllers/attendanceController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Employee routes
router.post("/checkin", isAuthenticated, checkIn);
router.post("/checkout", isAuthenticated, checkOut);
router.get("/today-status", isAuthenticated, getMyTodayStatus);
router.get("/my", isAuthenticated, getMyAttendance);

// ✅ Admin routes
router.post("/mark", isAuthenticated, isAdmin, markAttendance);
router.get("/:date", isAuthenticated, isAdmin, getAttendanceByDate);

export default router;