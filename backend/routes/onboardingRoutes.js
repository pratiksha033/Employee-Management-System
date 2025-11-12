import express from "express";
import {
  getOnboard,
  markComplete,
} from "../controllers/onboardingController.js";

const router = express.Router();
router.get("/", getOnboard);
router.put("/:id", markComplete);
export default router;
