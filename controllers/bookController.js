import Book from "../models/bookModel";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import User from "../models/userModel";
import ErrorHandler from "../utils/errorHandler";

export const addBook = catchAsyncErrors(async (req, res, next) => {
  const { title, author, description, price, quantity } = req.body;

  if (!title || !author || !description || !price || !quantity) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const book = await Book.create({
    title,
    author,
    description,
    price,
    quantity,
  });

  res.status(201).json({
    success: true,
    message: "Book added successfully",
    book,
  });
});

export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const book = await Book.findByIdAndDelete(id);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
  });
});

export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
  const books = await Book.find();
  res.status(200).json({ success: true, books });
});
