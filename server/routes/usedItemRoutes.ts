import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  createUsedItem,
  getUsedItems,
  getMyUsedItems,
  getMarketplaceStatus,
  updateUsedItemStatus,
  deleteUsedItem,
  upgradeToLifetime
} from '../controllers/usedItemController';

const router = Router();

router.get('/', getUsedItems);
router.get('/my', authMiddleware, getMyUsedItems);
router.get('/status', authMiddleware, getMarketplaceStatus);
router.post('/', authMiddleware, createUsedItem);
router.post('/upgrade', authMiddleware, upgradeToLifetime);
router.put('/:id/status', authMiddleware, updateUsedItemStatus);
router.delete('/:id', authMiddleware, deleteUsedItem);

export default router;
