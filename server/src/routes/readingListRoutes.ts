import express from 'express';
import {
  addToReadingList,
  removeFromReadingList,
  getMyReadingList,
  checkInReadingList,
} from '../controllers/readingListController';
import { isAuthenticated, optionalAuth } from '../middlewares/authMiddleware';

const router: express.Router = express.Router();

router.get('/mine', isAuthenticated, getMyReadingList);
router.get('/check/:bookId', optionalAuth, checkInReadingList);
router.post('/:bookId', isAuthenticated, addToReadingList);
router.delete('/:bookId', isAuthenticated, removeFromReadingList);

export default router;
