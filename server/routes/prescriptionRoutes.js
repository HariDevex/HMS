import { Router } from 'express';
import { getPrescriptions, createPrescription, updateAdministration } from '../controllers/prescriptionController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

// All prescription endpoints require authentication
router.use(authenticate);

// Reads: clinical staff and patients
router.get('/', getPrescriptions);

// Prescribing strictly restricted to licensed physicians
router.post('/', requireRole(['doctor']), createPrescription);

// Medication administration restricted to nursing staff
router.post('/:id/administer', requireRole(['nurse', 'admin']), updateAdministration);

export default router;
