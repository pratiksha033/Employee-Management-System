import express from "express";
import {
  addSalary,
  getMySalary,
  getEmployeeSalary,
  getAllSalaries,
} from "../controllers/salaryController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Correct: Authenticate first, then authorize
router.get("/all", isAuthenticated, isAdmin, getAllSalaries);

// Admin-only routes
router.post("/add", isAuthenticated, isAdmin, addSalary);
router.get("/employee/:employeeId", isAuthenticated, isAdmin, getEmployeeSalary);

// Employee routes
router.get("/my-salary", isAuthenticated, getMySalary);

export default router;
