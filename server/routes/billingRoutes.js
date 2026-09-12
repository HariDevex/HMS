import { Router } from 'express';
import { getInvoices, getInvoiceById, recordPayment } from '../controllers/billingController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

// All billing endpoints require authentication
router.use(authenticate);

// Billing requires admin or reception (or patient for own bills)
router.use(requireRole(['admin', 'reception', 'patient']));

router.get('/', getInvoices);
router.get('/:id', getInvoiceById);
router.post('/:id/payments', recordPayment);

export default router;
