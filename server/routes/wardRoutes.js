import { Router } from 'express';
import { getWards, getBeds, assignBed, updateBedStatus } from '../controllers/wardController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

// All ward endpoints require authentication
router.use(authenticate);

router.get('/', getWards);
router.get('/beds', getBeds);

// Bed operations require admin or nurse
router.post('/beds/:bedId/assign', requireRole(['admin', 'nurse']), assignBed);
router.patch('/beds/:bedId/status', requireRole(['admin', 'nurse']), updateBedStatus);

export default router;
