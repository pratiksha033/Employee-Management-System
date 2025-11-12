import express from "express";
import {
  markAttendance,
  getAttendanceByDate,
} from "../controllers/attendanceController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/mark", isAuthenticated, markAttendance);
router.get("/:date", isAuthenticated, getAttendanceByDate);

export default router;
