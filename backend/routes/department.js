import express from "express";
// import {isAuthenticated} from "../middleware/authMiddleware.js";
import { addDepartment } from "../controllers/departmentController.js";


const router = express.Router();
router.post("/add",addDepartment)

export default router