import express from 'express';
import {
  placeHold,
  myHolds,
  getAllHolds,
  approveHold,
  rejectHold,
  releaseHold,
} from '../controllers/holdController';
import { isAuthenticated, isAuthorized } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/:bookId', isAuthenticated, placeHold);
router.get('/my-holds', isAuthenticated, myHolds);

router.get(
  '/',
  isAuthenticated,
  isAuthorized('admin'),
  getAllHolds
);
router.patch(
  '/:holdId/approve',
  isAuthenticated,
  isAuthorized('admin'),
  approveHold
);
router.patch(
  '/:holdId/reject',
  isAuthenticated,
  isAuthorized('admin'),
  rejectHold
);
router.patch(
  '/:holdId/release',
  isAuthenticated,
  isAuthorized('admin'),
  releaseHold
);

export default router;
