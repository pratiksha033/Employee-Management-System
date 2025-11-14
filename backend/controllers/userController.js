import { User } from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";

// ✅ REGISTER USER
export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please fill all required fields", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User already exists with this email", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userRole = role === "admin" ? "admin" : "employee";

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: userRole,
  });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );

  res.status(201).json({
    success: true,
    message: `${user.role} registered successfully`,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ✅ LOGIN USER
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter both email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ✅ LOGOUT
export const logout = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// ✅ GET PROFILE
export const getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("department", "name");
  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({
    success: true,
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

// ✅ UPDATE PROFILE
export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) return next(new ErrorHandler("Please provide name and email", 400));

  const user = await User.findById(req.user.id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  // Check for duplicate email
  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return next(new ErrorHandler("Email already in use", 400));
    user.email = email;
  }

  user.name = name;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

// ✅ CHANGE PASSWORD
export const changePassword = catchAsyncError(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword)
    return next(new ErrorHandler("Please fill all fields", 400));

  if (newPassword !== confirmPassword)
    return next(new ErrorHandler("New passwords do not match", 400));

  const user = await User.findById(req.user.id).select("+password");
  if (!user) return next(new ErrorHandler("User not found", 404));

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch)
    return next(new ErrorHandler("Current password is incorrect", 400));

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});
