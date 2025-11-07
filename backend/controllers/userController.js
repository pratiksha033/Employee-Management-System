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
// --- NEW: Update User Profile (Name & Email) ---
export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return next(new ErrorHandler("Please provide name and email", 400));
  }

  const user = await User.findById(req.user.id);

  // Check if email is being changed and if the new email is already taken
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Email already in use", 400));
    }
    user.email = email;
  }

  user.name = name;
  await user.save();

  // Send back updated, non-sensitive user info
  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      dob: user.dob,
      department: user.department,
    },
  });
});

// --- NEW: Change Password ---
export const changePassword = catchAsyncError(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("Please fill all password fields", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("New passwords do not match", 400));
  }

  if (newPassword.length < 6) {
     return next(new ErrorHandler("Password must be at least 6 characters", 400));
  }

  // Find user and explicitly select the password field
  const user = await User.findById(req.user.id).select("+password");

  // Check if current password is correct
  const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect current password", 400));
  }

  // Hash and save new password
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully.",
  });
});