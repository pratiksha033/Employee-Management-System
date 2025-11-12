import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";
import { User } from "../models/userSchema.js";
import { catchAsyncError } from "./catchAsyncError.js";

/**
 * ✅ Middleware: Verify Authentication
 * Supports both:
 *  - Bearer Token (header)
 *  - Cookie-based token (fallback)
 */
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  let token;

  // 1️⃣ Try Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2️⃣ Fallback: Check cookies
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  // 3️⃣ If no token found
  if (!token) {
    return next(new ErrorHandler("Login first to access this resource.", 401));
  }

  // 4️⃣ Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5️⃣ Attach user object to request
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return next(new ErrorHandler("User not found.", 404));
    }

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new ErrorHandler("Invalid token. Please login again.", 401));
    }
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Token has expired. Please login again.", 401));
    }

    // Any other error
    return next(new ErrorHandler("Authentication failed.", 401));
  }
});

/**
 * ✅ Middleware: Check Admin Role
 * Ensures only admins can perform certain actions.
 */
export const isAdmin = catchAsyncError(async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new ErrorHandler("Access denied. Admin role required.", 403));
  }
  next();
});
