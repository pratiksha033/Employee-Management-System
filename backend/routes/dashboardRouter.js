import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All dashboard routes are for admins
router.use(isAuthenticated);
router.use(isAdmin);

router.get("/stats", getDashboardStats);

export default router;