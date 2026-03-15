import express from 'express';
import { addNotifyRequest, removeNotifyRequest, checkNotifyRequest } from '../controllers/notifyRequestController';
import { isAuthenticated, optionalAuth } from '../middlewares/authMiddleware';

const router: express.Router = express.Router();

router.get('/check/:bookId', optionalAuth, checkNotifyRequest);
router.post('/:bookId', isAuthenticated, addNotifyRequest);
router.delete('/:bookId', isAuthenticated, removeNotifyRequest);

export default router;
