import express from "express";
import {
  addDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Allow all authenticated users to see departments
router.get("/", isAuthenticated, getAllDepartments);

// 🔐 Only admins can manage departments
router.post("/add", isAuthenticated, isAdmin, addDepartment);
router.put("/update/:id", isAuthenticated, isAdmin, updateDepartment);
router.delete("/delete/:id", isAuthenticated, isAdmin, deleteDepartment);

export default router;
