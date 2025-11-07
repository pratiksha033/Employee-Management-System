import express from "express";
import { register, login, logout, getUserProfile , updateProfile, // <-- ADDED
    changePassword, } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", isAuthenticated, getUserProfile);
router.put("/update/profile", isAuthenticated, updateProfile); // <-- ADDED
router.put("/update/password", isAuthenticated, changePassword); // <-- ADDED

export default router;