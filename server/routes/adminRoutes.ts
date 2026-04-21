import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/adminAuth';
import { 
  getAllBusinesses, 
  getAllCategories, 
  createCategory, 
  deleteCategory, 
  updateBusinessStatus,
  deleteBusiness,
  getStats
} from '../controllers/adminController';
import { 
  getPendingPayments, 
  approvePayment, 
  rejectPayment, 
  directUpgrade,
  downgradeToFree
} from '../controllers/paymentController';

const router = Router();

// All admin routes require authentication and founder role
router.use(authMiddleware, adminMiddleware);

router.get('/stats', getStats);
router.get('/businesses', getAllBusinesses);
router.get('/categories', getAllCategories);
router.post('/categories', createCategory);
router.delete('/categories/:id', deleteCategory);
router.put('/businesses/:id/status', updateBusinessStatus);
router.delete('/businesses/:id', deleteBusiness);

// Payment management
router.get('/payments', getPendingPayments);
router.put('/payments/:id/approve', approvePayment);
router.put('/payments/:id/reject', rejectPayment);
router.put('/businesses/:id/upgrade', directUpgrade);
router.put('/businesses/:id/downgrade', downgradeToFree);

export default router;
