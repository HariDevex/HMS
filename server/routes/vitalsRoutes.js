import { Router } from 'express';
import { getPatientVitals, recordVitals } from '../controllers/vitalsController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

// All vitals endpoints require authentication
router.use(authenticate);

router.get('/:patientId', getPatientVitals);

// Recording vitals is restricted to clinical physician or nursing staff
router.post('/:patientId', requireRole(['doctor', 'nurse']), recordVitals);

export default router;
