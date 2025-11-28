import express from 'express';
import {
  register,
  verifyOtp,
  login,
  logout,
  getUser,
  forgotPassword,
  resetPassword,
  updatePassword,
} from '../controllers/authController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.get('/logout', isAuthenticated, logout);
router.get('/me', isAuthenticated, getUser);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.put('/password/update', isAuthenticated, updatePassword);

export default router;

