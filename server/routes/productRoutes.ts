import { Router } from 'express';
import { 
  createProduct, 
  getProductsByBusiness, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/:business_id', getProductsByBusiness);

router.use(authMiddleware);

router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
