import { Router } from 'express';
import { getLabOrders, getLabOrderById, createLabOrder, verifyLabOrder } from '../controllers/labController.js';

const router = Router();
router.get('/', getLabOrders);
router.get('/:id', getLabOrderById);
router.post('/', createLabOrder);
router.post('/:id/verify', verifyLabOrder);

export default router;
