import { Response, NextFunction } from 'express';
import { catchAsyncErrors, ErrorHandler } from '../middlewares/errorMiddleware';
import User from '../models/userModel';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../types';

export const getAllUsers = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const users = await User.find({ accountVerified: true });

    res.status(200).json({ success: true, users });
  }
);

export const registerNewAdmin = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new ErrorHandler('All fields are required', 400));
    }

    const isRegistered = await User.findOne({ email, accountVerified: true });

    if (isRegistered) {
      return next(new ErrorHandler('User already exists', 400));
    }

    if (password.length < 6 || password.length > 12) {
      return next(
        new ErrorHandler('Password must be between 6 and 12 characters', 400)
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      accountVerified: true,
    });

    res.status(201).json({ 
      success: true, 
      message: 'Admin registered successfully', 
      user 
    });
  }
);

