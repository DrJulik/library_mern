import express from 'express';
import { submitRating, getUserRating } from '../controllers/ratingController';
import { isAuthenticated, optionalAuth } from '../middlewares/authMiddleware';

const router: express.Router = express.Router();

router.post('/:bookId', isAuthenticated, submitRating);
router.get('/:bookId', optionalAuth, getUserRating);

export default router;
