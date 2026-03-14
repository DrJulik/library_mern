import express from 'express';
import { isAuthenticated, isAuthorized, optionalAuth } from '../middlewares/authMiddleware';
import { addBook, deleteBook, getAllBooks, getBookById, bulkUploadBooks } from '../controllers/bookController';

const router: express.Router = express.Router();

router.post('/add', isAuthenticated, isAuthorized('admin'), addBook);
router.delete('/delete/:id', isAuthenticated, isAuthorized('admin'), deleteBook);
router.get('/all', getAllBooks);
router.post('/bulk', isAuthenticated, isAuthorized('admin'), bulkUploadBooks);
router.get('/:id', optionalAuth, getBookById);

export default router;

