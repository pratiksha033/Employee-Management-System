import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";
import { User } from "../models/userSchema.js";

export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Login first to access this resource.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = await User.findById(decoded._id);
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid token. Please login again.", 401));
  }
};
