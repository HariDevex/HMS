import { Router } from 'express';
import { getReportsSummary } from '../controllers/reportsController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

// Reports require authentication and admin/doctor role
router.use(authenticate);
router.use(requireRole(['admin', 'doctor']));

router.get('/summary', getReportsSummary);

export default router;
