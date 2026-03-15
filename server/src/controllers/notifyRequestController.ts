import { Response, NextFunction } from 'express';
import NotifyRequest from '../models/notifyRequestModel';
import Book from '../models/bookModel';
import sendEmail from '../utils/sendEmail';
import { catchAsyncErrors, ErrorHandler } from '../middlewares/errorMiddleware';
import { AuthRequest } from '../types';

export const addNotifyRequest = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { bookId } = req.params;
    const userId = req.user?._id;

    if (!userId) return next(new ErrorHandler('Authentication required', 401));

    const book = await Book.findById(bookId);
    if (!book) return next(new ErrorHandler('Book not found', 404));

    if (book.available) {
      return res.status(400).json({ success: false, message: 'Book is already available' });
    }

    const existing = await NotifyRequest.findOne({ user: userId, book: bookId });
    if (existing) {
      return res.status(200).json({ success: true, message: "We'll notify you when it's available", notified: true });
    }

    await NotifyRequest.create({ user: userId, book: bookId });
    res.status(201).json({ success: true, message: "We'll notify you when it's available", notified: true });
  }
);

export const removeNotifyRequest = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { bookId } = req.params;
    const userId = req.user?._id;

    if (!userId) return next(new ErrorHandler('Authentication required', 401));

    await NotifyRequest.findOneAndDelete({ user: userId, book: bookId });
    res.status(200).json({ success: true, message: 'Notification removed', notified: false });
  }
);

export const checkNotifyRequest = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { bookId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(200).json({ success: true, notified: false });
    }

    const found = await NotifyRequest.findOne({ user: userId, book: bookId });
    res.status(200).json({ success: true, notified: !!found });
  }
);

export async function notifyUsersBookAvailable(bookId: string, bookTitle: string): Promise<void> {
  const requests = await NotifyRequest.find({ book: bookId }).populate('user', 'email name');
  if (requests.length === 0) return;

  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const bookUrl = `${baseUrl}/books/${bookId}`;

  for (const req of requests) {
    const user = req.user as { email?: string; name?: string };
    if (user?.email) {
      try {
        await sendEmail({
          email: user.email,
          subject: `"${bookTitle}" is now available at Gotham City Public Library`,
          message: `
            <p>Hi ${user.name || 'there'},</p>
            <p>Good news! A book you requested is now available:</p>
            <p><strong>${bookTitle}</strong></p>
            <p><a href="${bookUrl}">View and place a hold</a></p>
            <p>— Gotham City Public Library</p>
          `,
        });
      } catch (err) {
        console.error('Failed to send availability notification:', err);
      }
    }
  }

  await NotifyRequest.deleteMany({ book: bookId });
}
