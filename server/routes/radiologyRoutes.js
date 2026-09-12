import { Router } from 'express';
import { getRadiologyOrders, getRadiologyOrderById, createRadiologyOrder, verifyRadiologyReport } from '../controllers/radiologyController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

// All radiology endpoints require authentication
router.use(authenticate);

router.get('/', getRadiologyOrders);
router.get('/:id', getRadiologyOrderById);

// Ordering imaging scans requires physician/clinical authority
router.post('/', requireRole(['doctor', 'admin']), createRadiologyOrder);

// Report verification strictly restricted to certified radiologist
router.post('/:id/verify', requireRole(['radiology']), verifyRadiologyReport);

export default router;
