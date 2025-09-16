import express from "express";
// import {isAuthenticated} from "../middleware/authMiddleware.js";
import { addDepartment, getDepartments, editDepartment, updateDepartment, deleteDepartment } from "../controllers/departmentController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";


const router = express.Router();
// router.get("/",isAuthenticated,getDepartments);
router.get("/",getDepartments);
router.post("/add",addDepartment);
router.get("/:id",editDepartment);
router.put("/:id",updateDepartment);
router.delete("/:id",deleteDepartment);

export default router