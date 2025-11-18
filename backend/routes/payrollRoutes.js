import express from "express";
import {
  generatePayroll,
  getAllPayrolls,
  getMyPayrolls,
  getEmployeesByDepartment,
} from "../controllers/payrollController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin Routes
router.post("/generate", isAuthenticated, isAdmin, generatePayroll);
router.get("/all", isAuthenticated, isAdmin, getAllPayrolls);
router.get("/department/:departmentId/employees", isAuthenticated, isAdmin, getEmployeesByDepartment);

// Employee Route
router.get("/my", isAuthenticated, getMyPayrolls);

export default router;
