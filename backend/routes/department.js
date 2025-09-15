import express from "express";
// import {isAuthenticated} from "../middleware/authMiddleware.js";
import { addDepartment, getDepartments } from "../controllers/departmentController.js";


const router = express.Router();
router.get("/",getDepartments)
router.post("/add",addDepartment)

export default router