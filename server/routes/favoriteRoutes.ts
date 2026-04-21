import express from 'express';
import { toggleFavorite, getUserFavorites, checkFavoriteStatus } from '../controllers/favoriteController.ts';
import { authMiddleware } from '../middleware/auth.ts';

const router = express.Router();

router.post('/toggle', authMiddleware, toggleFavorite);
router.get('/my', authMiddleware, getUserFavorites);
router.get('/status/:businessId', authMiddleware, checkFavoriteStatus);

export default router;
