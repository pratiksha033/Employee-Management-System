import express from "express";
import {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js"; // Import new isAdmin middleware

const router = express.Router();

// All routes are protected and require admin access
router.use(isAuthenticated);
router.use(isAdmin);

router.post("/add", addEmployee);
router.get("/all", getAllEmployees);
router.get("/:id", getEmployeeById);
router.put("/update/:id", updateEmployee);
router.delete("/delete/:id", deleteEmployee);

export default router;