import express from 'express';
import { trackLead, getLeadsSummary, getLeads } from '../controllers/leadController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', trackLead);
router.get('/summary', authMiddleware, getLeadsSummary);
router.get('/', authMiddleware, getLeads);

export default router;
