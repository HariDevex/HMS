import { Router } from 'express';
import { getInvoices, getInvoiceById, recordPayment } from '../controllers/billingController.js';

const router = Router();
router.get('/', getInvoices);
router.get('/:id', getInvoiceById);
router.post('/:id/payments', recordPayment);

export default router;
