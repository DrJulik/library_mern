import express from 'express';
import {
  borrowedBooks,
  getBorrowedBooksAdmin,
  recordBorrowedBook,
  recordReturnedBook,
} from '../controllers/borrowController';
import { isAuthenticated, isAuthorized } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/my-borrowed-books', isAuthenticated, borrowedBooks);
router.get(
  '/borrowed-books-by-users',
  isAuthenticated,
  isAuthorized('admin'),
  getBorrowedBooksAdmin
);
router.post(
  '/record-borrowed-book/:bookId',
  isAuthenticated,
  isAuthorized('admin'),
  recordBorrowedBook
);
router.post(
  '/record-returned-book/:bookId',
  isAuthenticated,
  isAuthorized('admin'),
  recordReturnedBook
);

export default router;

