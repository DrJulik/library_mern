import { Response, NextFunction } from 'express';
import { catchAsyncErrors, ErrorHandler } from '../middlewares/errorMiddleware';
import Borrow from '../models/borrowModel';
import Book from '../models/bookModel';
import User from '../models/userModel';
import { AuthRequest } from '../types';

export const borrowedBooks = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const borrowedBooks = req.user?.borrowedBooks;

    res.status(200).json({ success: true, borrowedBooks });
  }
);

export const getBorrowedBooksAdmin = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const borrowedBooks = await Borrow.find()
      .populate('user', 'name email')
      .populate('book', 'title author');

    res.status(200).json({ success: true, borrowedBooks });
  }
);

export const recordBorrowedBook = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { bookId } = req.params;
    const { email } = req.body;

    const book = await Book.findById(bookId);

    if (!book) {
      return next(new ErrorHandler('Book not found', 404));
    }

    const user = await User.findOne({ email, accountVerified: true });

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    if (book.quantity <= 0) {
      return next(new ErrorHandler('Book is not available', 400));
    }

    if (user.borrowedBooks.length >= 3) {
      return next(new ErrorHandler('You have reached the maximum limit', 400));
    }

    const isAlreadyBorrowed = user.borrowedBooks.find(
      (b) => b.bookId.toString() === bookId && !b.returned
    );

    if (isAlreadyBorrowed) {
      return next(new ErrorHandler('You have already borrowed this book', 400));
    }

    book.quantity -= 1;
    book.available = book.quantity > 0;
    await book.save();

    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    user.borrowedBooks.push({
      bookId: book._id,
      bookTitle: book.title,
      returned: false,
      borrowedDate: new Date(),
      dueDate,
    });

    await user.save();

    await Borrow.create({
      user: user._id,
      book: book._id,
      borrowedDate: new Date(),
      dueDate,
      status: 'borrowed',
    });

    res.status(200).json({ 
      success: true,
      message: 'Book borrowed successfully' 
    });
  }
);

export const recordReturnedBook = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { bookId } = req.params;
    const { email } = req.body;

    const book = await Book.findById(bookId);

    if (!book) {
      return next(new ErrorHandler('Book not found', 404));
    }

    const user = await User.findOne({ email, accountVerified: true });

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    const borrowedBook = user.borrowedBooks.find(
      (b) => b.bookId.toString() === bookId && !b.returned
    );

    if (!borrowedBook) {
      return next(new ErrorHandler('You have not borrowed this book', 400));
    }

    borrowedBook.returned = true;
    await user.save();

    book.quantity += 1;
    book.available = book.quantity > 0;
    await book.save();

    const borrow = await Borrow.findOne({
      book: bookId,
      user: user._id,
      returnDate: null,
    });

    if (borrow) {
      borrow.returnDate = new Date();
      borrow.status = 'returned';
      await borrow.save();
    }

    res.status(200).json({
      success: true,
      message: 'Book returned successfully',
    });
  }
);

