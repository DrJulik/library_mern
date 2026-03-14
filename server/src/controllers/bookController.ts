import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Book from '../models/bookModel';
import Rating from '../models/ratingModel';
import { catchAsyncErrors, ErrorHandler } from '../middlewares/errorMiddleware';
import { AuthRequest } from '../types';

export const addBook = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { title, author, description, price, quantity, genre, language, yearPublished, imageLink, isbn, publisher, pages, slug, subtitle } = req.body;

    if (!title || !author || !description || !price || !quantity) {
      return next(new ErrorHandler('All fields are required', 400));
    }

    const book = await Book.create({
      title,
      author,
      description,
      price,
      quantity,
      ...(genre != null && genre !== '' && { genre }),
      ...(language != null && language !== '' && { language }),
      ...(yearPublished != null && !Number.isNaN(Number(yearPublished)) && { yearPublished: Number(yearPublished) }),
      ...(imageLink != null && imageLink !== '' && { imageLink }),
      ...(isbn != null && isbn !== '' && { isbn }),
      ...(publisher != null && publisher !== '' && { publisher }),
      ...(pages != null && !Number.isNaN(Number(pages)) && { pages: Number(pages) }),
      ...(slug != null && slug !== '' && { slug }),
      ...(subtitle != null && subtitle !== '' && { subtitle }),
    });

    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      book,
    });
  }
);

export const deleteBook = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    
    if (!book) {
      return next(new ErrorHandler('Book not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  }
);

export const getAllBooks = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const books = await Book.find();
    const bookIds = books.map((b) => b._id);
    const ratingStats = await Rating.aggregate([
      { $match: { book: { $in: bookIds } } },
      { $group: { _id: '$book', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const ratingMap = new Map(
      ratingStats.map((r) => [r._id.toString(), { averageRating: Math.round(r.avg * 10) / 10, ratingCount: r.count }])
    );
    const booksWithRatings = books.map((b) => {
      const stats = ratingMap.get(b._id.toString());
      return {
        ...b.toObject(),
        averageRating: stats?.averageRating ?? null,
        ratingCount: stats?.ratingCount ?? 0,
      };
    });
    res.status(200).json({ success: true, books: booksWithRatings });
  }
);

export const getBookById = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return next(new ErrorHandler('Book not found', 404));
    }
    const bookId = book._id;
    const [stats, userRatingDoc] = await Promise.all([
      Rating.aggregate([
        { $match: { book: new mongoose.Types.ObjectId(bookId) } },
        { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
      ]),
      req.user
        ? Rating.findOne({ user: req.user._id, book: bookId }).select('rating')
        : Promise.resolve(null),
    ]);
    const agg = stats[0];
    const averageRating = agg ? Math.round(agg.avg * 10) / 10 : null;
    const ratingCount = agg?.count ?? 0;
    const userRating = userRatingDoc ? userRatingDoc.rating : null;
    const bookObj = book.toObject();
    res.status(200).json({
      success: true,
      book: {
        ...bookObj,
        averageRating,
        ratingCount,
        userRating,
      },
    });
  }
);

const MAX_BULK_BOOKS = 500;

function isValidBook(item: unknown): item is { title: string; author: string; description: string; price: number; quantity: number } {
  if (!item || typeof item !== 'object') return false;
  const o = item as Record<string, unknown>;
  return (
    typeof o.title === 'string' && o.title.trim() !== '' &&
    typeof o.author === 'string' && o.author.trim() !== '' &&
    typeof o.description === 'string' && o.description.trim() !== '' &&
    typeof o.price === 'number' && !Number.isNaN(o.price) && o.price >= 0 &&
    typeof o.quantity === 'number' && !Number.isNaN(o.quantity) && o.quantity >= 0 && Number.isInteger(o.quantity)
  );
}

export const bulkUploadBooks = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { books } = req.body;

    if (!Array.isArray(books)) {
      return next(new ErrorHandler('Request body must contain an array "books"', 400));
    }
    if (books.length > MAX_BULK_BOOKS) {
      return next(new ErrorHandler(`Cannot upload more than ${MAX_BULK_BOOKS} books at once`, 400));
    }
    if (books.length === 0) {
      return res.status(400).json({ success: false, message: 'Books array is empty' });
    }

    for (let i = 0; i < books.length; i++) {
      if (!isValidBook(books[i])) {
        return next(new ErrorHandler(`Invalid book at index ${i}: missing or invalid title, author, description, price, or quantity`, 400));
      }
    }

    const optional = (b: Record<string, unknown>, key: string) => {
      const v = b[key];
      if (v === undefined || v === null) return undefined;
      if (key === 'yearPublished' || key === 'pages') return typeof v === 'number' && !Number.isNaN(v) ? v : undefined;
      if (typeof v === 'string' && v.trim() !== '') return v.trim();
      return undefined;
    };

    const toInsert = books.map((b: Record<string, unknown>) => {
      const base = {
        title: (b.title as string).trim(),
        author: (b.author as string).trim(),
        description: (b.description as string).trim(),
        price: Number(b.price),
        quantity: Number(b.quantity),
      };
      const genre = optional(b, 'genre');
      const language = optional(b, 'language');
      const yearPublished = optional(b, 'yearPublished');
      const imageLink = optional(b, 'imageLink');
      const isbn = optional(b, 'isbn');
      const publisher = optional(b, 'publisher');
      const pages = optional(b, 'pages');
      const slug = optional(b, 'slug');
      const subtitle = optional(b, 'subtitle');
      return {
        ...base,
        ...(genre !== undefined && { genre }),
        ...(language !== undefined && { language }),
        ...(yearPublished !== undefined && { yearPublished }),
        ...(imageLink !== undefined && { imageLink }),
        ...(isbn !== undefined && { isbn }),
        ...(publisher !== undefined && { publisher }),
        ...(pages !== undefined && { pages }),
        ...(slug !== undefined && { slug }),
        ...(subtitle !== undefined && { subtitle }),
      };
    });

    const created = await Book.insertMany(toInsert);

    res.status(201).json({
      success: true,
      message: 'Bulk upload successful',
      created: created.length,
    });
  }
);

