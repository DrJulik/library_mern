import express from 'express';
import { uploadBookImage } from '../controllers/uploadController';
import { isAuthenticated, isAuthorized } from '../middlewares/authMiddleware';

const router: express.Router = express.Router();

router.post('/book-image', isAuthenticated, isAuthorized('admin'), uploadBookImage);

export default router;
