import express from "express";
import {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(isAuthenticated);
router.use(isAdmin);

// ➕ Add Employee
router.post("/add", addEmployee);

// 📋 Get all employees
router.get("/all", getAllEmployees);

// 🔍 Get single employee by ID
router.get("/:id", getEmployeeById);

// ✏️ Update employee
router.put("/update/:id", updateEmployee);

// ❌ Delete employee
router.delete("/delete/:id", deleteEmployee);

export default router;
