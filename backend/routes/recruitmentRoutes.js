import express from "express";
import {
  getApplicants,
  updateStage,
  deleteApplicant,
} from "../controllers/recruitmentController.js";

const router = express.Router();
router.get("/", getApplicants);
router.put("/:id", updateStage);
router.delete("/:id", deleteApplicant);
export default router;
