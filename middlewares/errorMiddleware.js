// Error Handler Class
export class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Async Error Handler
export const catchAsyncErrors = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Error Middleware
export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong MongoDB ID Error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT Error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again`;
    err = new ErrorHandler(message, 400);
  }

  // JWT Expire Error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
}; 