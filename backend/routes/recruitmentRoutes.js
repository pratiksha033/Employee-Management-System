import express from "express";
import {
  getRecruitment,
  getJobs,
  createJob,
  updateJobStats,
  updateApplicantStage,
} from "../controllers/recruitmentController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isAuthenticated, getRecruitment);
router.get("/jobs", isAuthenticated, getJobs);

router.post("/job", isAuthenticated, isAdmin, createJob);

router.put("/job/:id", isAuthenticated, isAdmin, updateJobStats);
router.put("/:id", isAuthenticated, isAdmin, updateApplicantStage);

export default router;
