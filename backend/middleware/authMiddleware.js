import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";
import { User } from "../models/userSchema.js";
import { catchAsyncError } from "./catchAsyncError.js"; // Import catchAsyncError

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  // Check for token in Authorization header
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // If no header token, check cookies (fallback)
  if (!token) {
    token = req.cookies.token;
  }

  // If no token found in either location
  if (!token) {
    return next(new ErrorHandler("Login first to access this resource.", 401));
  }

  try {
    // Verify the token using JWT_SECRET from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request object
    req.user = await User.findById(decoded.id);

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
    // Forward other errors
    return next(error);
  }
});

export const isAdmin = catchAsyncError(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ErrorHandler("Access denied. Admin role required.", 403));
  }
  next();
});
