import express from 'express';
import { getAllUsers, registerNewAdmin } from '../controllers/userController';
import { isAuthenticated, isAuthorized } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/all', isAuthenticated, isAuthorized('admin'), getAllUsers);
router.post('/add/admin', isAuthenticated, isAuthorized('admin'), registerNewAdmin);

export default router;

