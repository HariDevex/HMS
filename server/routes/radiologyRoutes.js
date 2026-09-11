import { Router } from 'express';
import { getRadiologyOrders, getRadiologyOrderById, createRadiologyOrder, verifyRadiologyReport } from '../controllers/radiologyController.js';

const router = Router();
router.get('/', getRadiologyOrders);
router.get('/:id', getRadiologyOrderById);
router.post('/', createRadiologyOrder);
router.post('/:id/verify', verifyRadiologyReport);

export default router;
