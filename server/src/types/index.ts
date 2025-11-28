import { Document, Types } from 'mongoose';

// User Types
export interface IBorrowedBook {
  bookId: Types.ObjectId;
  returned: boolean;
  bookTitle: string;
  borrowedDate: Date;
  dueDate: Date;
}

export interface IAvatar {
  public_id: string;
  url: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  accountVerified: boolean;
  borrowedBooks: IBorrowedBook[];
  avatar?: IAvatar;
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

// Request Types
export interface AuthRequest extends Express.Request {
  user?: IUser;
}

