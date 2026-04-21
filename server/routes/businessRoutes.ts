import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { 
  getBusinesses, 
  getBusinessById, 
  createBusiness, 
  getBusinessesBySeller, 
  updateBusiness, 
  deleteBusiness 
} from '../controllers/businessController';

const router = Router();

router.get('/', getBusinesses);
router.post('/', authMiddleware, createBusiness);
router.get('/:id', getBusinessById);
router.get('/seller/:seller_id', getBusinessesBySeller);
router.put('/:id', authMiddleware, updateBusiness);
router.delete('/:id', authMiddleware, deleteBusiness);

export default router;
