import ErrorHandler from "./error.js";

/**
 * 🔐 Middleware Factory: Check if user has any allowed role(s)
 * @param  {...String} roles - Roles allowed to access the route
 * @returns Middleware function
 */
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    // Make sure user exists (requires isAuthenticated before this)
    if (!req.user) {
      return next(new ErrorHandler("Unauthorized. No user data found.", 401));
    }

    // Check if user role matches allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Access denied. Required role: ${roles.join(" or ")}`,
          403
        )
      );
    }

    next();
  };
};
