import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { isAuthenticated , isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", isAuthenticated, getDashboard);

export default router;
