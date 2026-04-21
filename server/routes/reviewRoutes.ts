import express from 'express';
import { getBusinessReviews, createReview, deleteReview } from '../controllers/reviewController.ts';
import { authMiddleware } from '../middleware/auth.ts';

const router = express.Router();

router.get('/:businessId', getBusinessReviews);
router.post('/', authMiddleware, createReview);
router.delete('/:id', authMiddleware, deleteReview);

export default router;
