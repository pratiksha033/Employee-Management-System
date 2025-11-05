import express from "express";
import {
  addDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.use(isAuthenticated);

// Department CRUD routes
router.post("/add", addDepartment);
router.get("/", getAllDepartments); // GET all departments
router.put("/update/:id", updateDepartment);
router.delete("/delete/:id", deleteDepartment);

export default router;