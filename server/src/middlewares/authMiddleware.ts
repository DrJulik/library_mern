import { Response, NextFunction } from 'express';
import { catchAsyncErrors, ErrorHandler } from './errorMiddleware';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { AuthRequest } from '../types';

interface JwtPayload {
  id: string;
}

export const isAuthenticated = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;
    
    if (!token) {
      return next(new ErrorHandler('Please login to access this resource', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }
    
    req.user = user;
    next();
  }
);

export const isAuthorized = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ErrorHandler('User not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler('You are not authorized to access this resource', 403)
      );
    }
    next();
  };
};

