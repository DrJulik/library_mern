import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Borrow from "../models/borrowModel.js";
import Book from "../models/bookModel.js";
import User from "../models/userModel.js";

export const borrowedBooks = catchAsyncErrors(async (req, res) => {
  const { borrowedBooks } = req.user;

  res.status(200).json({ success: true, borrowedBooks });
});

export const getBorrowedBooksAdmin = catchAsyncErrors(async (req, res) => {
  const borrowedBooks = await Borrow.find();

  res.status(200).json({ success: true, borrowedBooks });
});

export const recordBorrowedBook = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  const book = await Book.findById(id);

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  const user = await User.findOne({ email, accountVerified: true });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (book.quantity <= 0) {
    return next(new ErrorHandler("Book is not available", 400));
  }

  if (user.borrowedBooks.length >= 3) {
    return next(new ErrorHandler("You have reached the maximum limit", 400));
  }

  const isAlreadyBorrowed = user.borrowedBooks.find(
    (book) => book.book.toString() === id
  );

  if (isAlreadyBorrowed) {
    return next(new ErrorHandler("You have already borrowed this book", 400));
  }

  book.quantity -= 1;
  book.available = book.quantity > 0;
  await book.save();

  user.borrowedBooks.push({
    book: id,
    bookTitle: book.title,
    borrowedDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  await user.save();

  await Borrow.create({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    book: book._id,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    price: book.price,
  });

  res.status(200).json({ message: "Book borrowed successfully" });
});

export const recordReturnedBook = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  const book = await Book.findById(id);

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  const user = await User.findOne({ email, accountVerified: true });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const borrowedBook = user.borrowedBooks.find(
    (book) => book.bookId.toString() === id
  );

  if (!borrowedBook) {
    return next(new ErrorHandler("You have not borrowed this book", 400));
  }

  borrowedBook.returned = true;
  await user.save();

  book.quantity += 1;
  book.available = book.quantity > 0;
  await book.save();

  const borrow = await Borrow.findOne({
    book: id,
    "user.email": email,
    returnDate: null,
  });

  if (!borrow) {
    return next(new ErrorHandler("Book not borrowed", 400));
  }

  borrow.returnDate = new Date();
  await borrow.save();

  res.status(200).json({
    success: true,
    message: "Book returned successfully",
  });
});
