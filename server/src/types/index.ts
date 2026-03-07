import { Document, Types } from 'mongoose';
import { Request } from 'express';

// User Types
export interface IBorrowedBook {
  bookId: Types.ObjectId;
  returned: boolean;
  bookTitle: string;
  borrowedDate: Date;
  dueDate: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  accountVerified: boolean;
  borrowedBooks: IBorrowedBook[];
  verificationCode?: number;
  verificationCodeExpire?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  generateVerificationCode(): number;
  generateToken(): string;
  getResetPasswordToken(): string;
}

// Book Types
export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  price: number;
  quantity: number;
  available: boolean;
  genre?: string;
  language?: string;
  yearPublished?: number;
  imageLink?: string;
  isbn?: string;
  publisher?: string;
  pages?: number;
  slug?: string;
  subtitle?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Borrow Types
export interface IBorrow extends Document {
  user: Types.ObjectId | IUser;
  book: Types.ObjectId | IBook;
  borrowedDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  fine: number;
  notified: boolean;
  status: 'pending' | 'borrowed' | 'returned' | 'overdue';
}

// Hold Types
export type HoldStatus = 'pending' | 'approved' | 'fulfilled' | 'cancelled';

export interface IHold extends Document {
  user: Types.ObjectId | IUser;
  book: Types.ObjectId | IBook;
  status: HoldStatus;
  createdAt: Date;
}

// Request Types
export interface AuthRequest extends Request {
  user?: IUser;
}

