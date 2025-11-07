import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Allow all authenticated users (admin + employees)
router.use(isAuthenticated);

router.get("/stats", getDashboardStats);

export default router;
