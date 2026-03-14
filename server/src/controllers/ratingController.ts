import { Response, NextFunction } from 'express';
import Rating from '../models/ratingModel';
import Book from '../models/bookModel';
import { catchAsyncErrors, ErrorHandler } from '../middlewares/errorMiddleware';
import { AuthRequest } from '../types';

export const submitRating = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { bookId } = req.params;
    const { rating } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    const ratingNum = typeof rating === 'number' ? rating : Number(rating);
    if (Number.isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return next(new ErrorHandler('Rating must be between 1 and 5', 400));
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return next(new ErrorHandler('Book not found', 404));
    }

    const updated = await Rating.findOneAndUpdate(
      { user: userId, book: bookId },
      { rating: Math.round(ratingNum) },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Rating saved',
      rating: updated.rating,
    });
  }
);

export const getUserRating = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { bookId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(200).json({ success: true, rating: null });
    }

    const ratingDoc = await Rating.findOne({ user: userId, book: bookId });
    res.status(200).json({
      success: true,
      rating: ratingDoc ? ratingDoc.rating : null,
    });
  }
);
