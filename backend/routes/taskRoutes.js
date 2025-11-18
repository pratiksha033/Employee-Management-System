import express from "express";
import { getMyTasks, addTask } from "../controllers/taskController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", isAuthenticated, getMyTasks);
router.post("/add", isAuthenticated, addTask);

export default router;
