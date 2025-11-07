import { User } from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";

// ✅ REGISTER USER
export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password, role } = req.body; // ✅ include role

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please fill all required fields", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // ✅ include role when creating user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "employee", // defaults to employee if role not sent
  });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // ✅ send role in response too
    },
  });
});

// ✅ LOGIN USER
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // ✅ include role here too
    },
  });
});

// ✅ LOGOUT USER
export const logout = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// ✅ GET USER PROFILE
export const getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // ✅ show role here too
    },
  });
});