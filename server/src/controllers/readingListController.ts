import { Response, NextFunction } from 'express';
import ReadingList from '../models/readingListModel';
import Book from '../models/bookModel';
import { catchAsyncErrors, ErrorHandler } from '../middlewares/errorMiddleware';
import { AuthRequest } from '../types';

export const addToReadingList = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { bookId } = req.params;
    const userId = req.user?._id;

    if (!userId) return next(new ErrorHandler('Authentication required', 401));

    const book = await Book.findById(bookId);
    if (!book) return next(new ErrorHandler('Book not found', 404));

    const existing = await ReadingList.findOne({ user: userId, book: bookId });
    if (existing) {
      return res.status(200).json({ success: true, message: 'Already in reading list', inList: true });
    }

    await ReadingList.create({ user: userId, book: bookId });
    res.status(201).json({ success: true, message: 'Added to reading list', inList: true });
  }
);

export const removeFromReadingList = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { bookId } = req.params;
    const userId = req.user?._id;

    if (!userId) return next(new ErrorHandler('Authentication required', 401));

    await ReadingList.findOneAndDelete({ user: userId, book: bookId });
    res.status(200).json({ success: true, message: 'Removed from reading list', inList: false });
  }
);

export const getMyReadingList = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) return next(new ErrorHandler('Authentication required', 401));

    const items = await ReadingList.find({ user: userId })
      .populate('book', 'title author imageLink description _id')
      .sort({ createdAt: -1 })
      .lean();

    const withDates = items.map((i: { book: unknown; createdAt?: Date }) => ({
      book: i.book,
      createdAt: i.createdAt,
    }));
    const books = withDates.map((w) => w.book).filter(Boolean);

    res.status(200).json({ success: true, items: withDates, books });
  }
);

export const checkInReadingList = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { bookId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(200).json({ success: true, inList: false });
    }

    const found = await ReadingList.findOne({ user: userId, book: bookId });
    res.status(200).json({ success: true, inList: !!found });
  }
);
