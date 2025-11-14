import express from "express";
import {
  register,
  login,
  logout,
  getUserProfile,
  updateProfile,
  changePassword,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Profile routes
router.get("/profile", isAuthenticated, getUserProfile);
router.put("/update/profile", isAuthenticated, updateProfile);
router.put("/update/password", isAuthenticated, changePassword);

export default router;