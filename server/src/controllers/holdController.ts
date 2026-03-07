import { Response, NextFunction } from 'express';
import { catchAsyncErrors, ErrorHandler } from '../middlewares/errorMiddleware';
import Hold from '../models/holdModel';
import Book from '../models/bookModel';
import User from '../models/userModel';
import { AuthRequest } from '../types';

const MAX_HOLDS_PER_USER = 10;

export const placeHold = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { bookId } = req.params;
    const user = req.user!;

    const book = await Book.findById(bookId);
    if (!book) {
      return next(new ErrorHandler('Book not found', 404));
    }

    const existingHold = await Hold.findOne({
      user: user._id,
      book: bookId,
      status: { $in: ['pending', 'approved'] },
    });
    if (existingHold) {
      return next(new ErrorHandler('You already have a hold on this book', 400));
    }

    const activeBorrow = user.borrowedBooks?.find(
      (b) => b.bookId.toString() === bookId && !b.returned
    );
    if (activeBorrow) {
      return next(new ErrorHandler('You have already borrowed this book', 400));
    }

    const pendingOrApprovedCount = await Hold.countDocuments({
      user: user._id,
      status: { $in: ['pending', 'approved'] },
    });
    if (pendingOrApprovedCount >= MAX_HOLDS_PER_USER) {
      return next(
        new ErrorHandler(`You can have at most ${MAX_HOLDS_PER_USER} active holds`, 400)
      );
    }

    const hold = await Hold.create({
      user: user._id,
      book: bookId,
      status: 'pending',
    });

    const populated = await Hold.findById(hold._id)
      .populate('book', 'title author')
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Hold placed; pending admin approval',
      hold: populated,
    });
  }
);

export const myHolds = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user!;

    const holds = await Hold.find({ user: user._id })
      .populate('book', 'title author quantity available')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, holds });
  }
);

export const getAllHolds = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const status = req.query.status as string | undefined;

    const filter = status && ['pending', 'approved', 'fulfilled', 'cancelled'].includes(status)
      ? { status }
      : {};

    const holds = await Hold.find(filter)
      .populate('user', 'name email')
      .populate('book', 'title author')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, holds });
  }
);

export const approveHold = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { holdId } = req.params;

    const hold = await Hold.findById(holdId);
    if (!hold) {
      return next(new ErrorHandler('Hold not found', 404));
    }
    if (hold.status !== 'pending') {
      return next(new ErrorHandler('Only pending holds can be approved', 400));
    }

    const book = await Book.findById(hold.book);
    if (!book) {
      return next(new ErrorHandler('Book not found', 404));
    }
    if (book.quantity <= 0) {
      return next(new ErrorHandler('No copies available to reserve', 400));
    }

    book.quantity -= 1;
    book.available = book.quantity > 0;
    await book.save();

    hold.status = 'approved';
    await hold.save();

    const populated = await Hold.findById(hold._id)
      .populate('user', 'name email')
      .populate('book', 'title author');

    res.status(200).json({
      success: true,
      message: 'Hold approved',
      hold: populated,
    });
  }
);

export const rejectHold = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { holdId } = req.params;

    const hold = await Hold.findById(holdId);
    if (!hold) {
      return next(new ErrorHandler('Hold not found', 404));
    }
    if (hold.status !== 'pending') {
      return next(new ErrorHandler('Only pending holds can be rejected', 400));
    }

    hold.status = 'cancelled';
    await hold.save();

    res.status(200).json({
      success: true,
      message: 'Hold rejected',
    });
  }
);

export const releaseHold = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { holdId } = req.params;

    const hold = await Hold.findById(holdId);
    if (!hold) {
      return next(new ErrorHandler('Hold not found', 404));
    }
    if (hold.status !== 'approved') {
      return next(new ErrorHandler('Only approved holds can be released (no pickup)', 400));
    }

    const book = await Book.findById(hold.book);
    if (!book) {
      return next(new ErrorHandler('Book not found', 404));
    }

    book.quantity += 1;
    book.available = book.quantity > 0;
    await book.save();

    hold.status = 'cancelled';
    await hold.save();

    res.status(200).json({
      success: true,
      message: 'Hold released; book returned to availability',
    });
  }
);
