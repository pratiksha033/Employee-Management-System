class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Utility wrapper for async routes
export const catchAsyncErrors = (theFunc) => (req, res, next) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
};

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    if (err.name === "CastError") {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    if (err.name === "JsonWebTokenError") {
        const message = `JSON Web Token is invalid. Try again.`;
        err = new ErrorHandler(message, 400);
    }

    if (err.name === "TokenExpiredError") {
        const message = `JSON Web Token has expired. Try again.`;
        err = new ErrorHandler(message, 400);
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default ErrorHandler;