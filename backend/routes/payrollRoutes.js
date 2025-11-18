import express from "express";
import {
  generatePayroll,
  getAllPayrolls,
  getMyPayrolls,
} from "../controllers/payrollController.js";
import { downloadPayslip } from "../controllers/payrollPayslip.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ADMIN ONLY
router.post("/generate", isAuthenticated, isAdmin, generatePayroll);
router.get("/all", isAuthenticated, isAdmin, getAllPayrolls);

// EMPLOYEE
router.get("/my", isAuthenticated, getMyPayrolls);

// Payslip download
router.get("/payslip/:id", isAuthenticated, downloadPayslip);

export default router;
