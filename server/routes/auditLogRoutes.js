import { Router } from 'express';
import { getAuditLogs, createAuditLog } from '../controllers/reportsController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

// Audit logs require authentication
router.use(authenticate);

// Viewing audit logs strictly restricted to System Administrator
router.get('/', requireRole(['admin']), getAuditLogs);

// System/actions can record audit events
router.post('/', createAuditLog);

export default router;
