import { Router } from 'express';
import { submitPayment, upgradeToPrime } from '../controllers/paymentController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/submit', authMiddleware, submitPayment);
router.post('/upgrade-prime', authMiddleware, upgradeToPrime);

export default router;
