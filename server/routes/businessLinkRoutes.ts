import { Router } from 'express';
import { upsertBusinessLinks, getBusinessLinks } from '../controllers/businessLinkController';

const router = Router();

router.post('/', upsertBusinessLinks);
router.get('/:business_id', getBusinessLinks);

export default router;
