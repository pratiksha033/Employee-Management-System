import express from "express";
import { getMyTasks, addTask, updateTask, deleteTask } from "../controllers/taskController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", isAuthenticated, getMyTasks);
router.post("/add", isAuthenticated, addTask);
router.put("/update/:id", isAuthenticated, updateTask);
router.delete("/delete/:id", isAuthenticated, deleteTask);

export default router;
