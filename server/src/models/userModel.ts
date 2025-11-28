import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { IUser } from '../types';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minLength: [6, 'Password should be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    accountVerified: {
      type: Boolean,
      default: false,
    },
    borrowedBooks: [
      {
        bookId: {
          type: Schema.Types.ObjectId,
          ref: 'Borrow',
        },
        returned: {
          type: Boolean,
          default: false,
        },
        bookTitle: {
          type: String,
          required: true,
        },
        borrowedDate: {
          type: Date,
          default: Date.now,
        },
        dueDate: {
          type: Date,
        },
      },
    ],
    avatar: {
      public_id: {
        type: String,
      },
      url: String,
    },
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Generate verification code
userSchema.methods.generateVerificationCode = function (): number {
  function generateRandomFiveDigitCode(): number {
    return Math.floor(10000 + Math.random() * 90000);
  }
  this.verificationCode = generateRandomFiveDigitCode();
  this.verificationCodeExpire = Date.now() + 15 * 60 * 1000;
  return this.verificationCode;
};

userSchema.methods.generateToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: '2d',
  });
};

userSchema.methods.getResetPasswordToken = function (): string {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

export default mongoose.model<IUser>('User', userSchema);

