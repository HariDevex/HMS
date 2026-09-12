import { Router } from 'express';
import { getLabOrders, getLabOrderById, createLabOrder, verifyLabOrder } from '../controllers/labController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

// All lab endpoints require authentication
router.use(authenticate);

router.get('/', getLabOrders);
router.get('/:id', getLabOrderById);

// Ordering diagnostic labs requires physician/clinical authority
router.post('/', requireRole(['doctor', 'admin']), createLabOrder);

// Result verification strictly restricted to certified laboratory technologist
router.post('/:id/verify', requireRole(['lab']), verifyLabOrder);

export default router;
